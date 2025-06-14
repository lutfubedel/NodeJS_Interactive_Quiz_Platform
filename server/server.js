import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import routers from './routes/record.js';
import { getQuizQuestions } from './routes/record.js';
import { saveResultsToDatabase } from "./routes/record.js";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use('/api', routers);

// Multer: Geçici dosya yükleyici
const upload = multer({ dest: "uploads/" });

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Geliştirme için açık
  },
});


// Global odalar objesi
const rooms = {};  // { roomCode: [{ socketId, name, isHost }] }

io.on("connection", (socket) => {
  console.log("Yeni istemci bağlandı:", socket.id);
  socket.emit("connected", { message: "Socket.IO bağlantısı başarılı!" });

  socket.on("host-join-room", ({ roomCode, hostName, quizId }) => {
    if (!roomCode || !hostName || !quizId) {
      socket.emit("error", { message: "Oda kodu, host adı ve quiz ID gereklidir." });
      return;
    }

    socket.join(roomCode);

    // Oda daha önce oluşturulmamışsa oluştur
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        quizId,
        participants: [],
      };
    }

    // Host'u katılımcı listesine isHost: true ile ekle
    rooms[roomCode].participants.push({
      socketId: socket.id,
      name: hostName,
      isHost: true,
    });

    console.log(`Host oda oluşturdu: ${roomCode} (${hostName}) | Quiz ID: ${quizId}`);

    // Sadece isHost: false olan katılımcıları gönder
    const participants = rooms[roomCode].participants.filter(p => !p.isHost);
    io.to(roomCode).emit("update-participants", participants);
  });


    // **Buraya bu join-room event'ini ekle:**
  socket.on("join-room", ({ roomCode, participant }) => {
    const participantName = participant?.name;

    if (!roomCode || !participantName) {
      socket.emit("error", { message: "Oda kodu ve katılımcı adı gereklidir." });
      return;
    }

    if (!rooms[roomCode]) {
      socket.emit("error", { message: "Geçersiz oda kodu." });
      return;
    }

    socket.join(roomCode);

    rooms[roomCode].participants.push({
      socketId: socket.id,
      name: participantName,
      isHost: false,
    });

    console.log(`Katılımcı katıldı: ${participantName} -> ${roomCode}`);

    io.to(roomCode).emit("user-joined", {
      name: participantName,
      socketId: socket.id,
    });

    const participants = rooms[roomCode].participants.filter(p => !p.isHost);
    io.to(roomCode).emit("update-participants", participants);
  });

  socket.on("start-quiz", ({ roomCode }) => {
    console.log(`Quiz başlatma isteği: ${roomCode}`);
    // Güvenlik için kontrol edebilirsin: sadece host emit edebilsin diye
    if (rooms[roomCode]) {
      io.to(roomCode).emit("quiz-started");
      console.log(`Quiz başlatıldı: ${roomCode}`);
      console.log(rooms[roomCode]);
      startQuizFlow(roomCode);
    }
  });


  const startQuizFlow = async (roomCode) => {
    const quizId = rooms[roomCode].quizId;
    const questions = await getQuizQuestions(quizId);

    if (!questions || questions.length === 0) {
      io.to(roomCode).emit("quiz-finished");
      return;
    }

    rooms[roomCode].currentQuestionIndex = 0;
    rooms[roomCode].questions = questions;

    // 1. Önce quiz başlayacak diye haber verelim
    io.to(roomCode).emit("quiz-starting", { countdown: 10 });
    console.log(`Quiz ${roomCode} odasında 10 saniye sonra başlayacak.`);

    setTimeout(() => {
      io.to(roomCode).emit("quiz-started"); // Tetikleyici sinyal
      console.log(`Quiz ${roomCode} odasında başladı.`);

      askNextQuestion(roomCode); // Soruları başlat
    }, 10000);
  };

  const askNextQuestion = async (roomCode) => {
    const questions = rooms[roomCode].questions;
    const index = rooms[roomCode].currentQuestionIndex;

    if (index >= questions.length) {
      io.to(roomCode).emit("quiz-finished");

    const participants = rooms[roomCode].participants;
    const questions = rooms[roomCode].questions || [];
    const quizId = rooms[roomCode].quizId;
    const scores = calculateScores(participants, questions);

    await saveResultsToDatabase(quizId, roomCode, scores); // sadece scores gönder
    return;
    }

    const currentQuestion = questions[index];

    io.to(roomCode).emit("new-question", {
      index: index + 1,
      question: currentQuestion,
      timeLimit: 10,
    });

    setTimeout(() => {
      rooms[roomCode].currentQuestionIndex++;
      askNextQuestion(roomCode);
    }, 10000);
  };


  socket.on("submit-answer", ({ roomCode, answer, questionIndex }) => {
    const participant = rooms[roomCode]?.participants.find(p => p.socketId === socket.id);
    if (!participant) return;

    // `answers` dizisi yoksa oluştur
    if (!participant.answers) {
      participant.answers = [];
    }

    // Aynı soru için birden fazla cevap varsa, eski cevabı sil (opsiyonel ama önerilir)
    participant.answers = participant.answers.filter(a => a.questionIndex !== questionIndex);

    // Yeni cevabı ekle
    participant.answers.push({
      questionIndex,
      answer,
      timestamp: new Date(),
    });

    // Burada tüm oda katılımcılarının cevaplarını göster
    console.log(`Oda ${roomCode} katılımcıları ve cevapları:`);
    rooms[roomCode].participants.forEach(p => {
      console.log(`- ${p.name} (Host: ${p.isHost}): Answers =`, p.answers || []);
    });

    // Her cevaptan sonra skorları hesapla ve host'a gönder
    const participants = rooms[roomCode].participants;
    const questions = rooms[roomCode].questions || [];
    const scores = calculateScores(participants, questions);

    console.log(`Oda ${roomCode} skorları:`, scores);
    io.to(roomCode).emit("update-scoreboard", scores);

  });


  socket.on("get-results", ({ roomCode }) => {
    console.log(`Sonuçlar isteniyor: ${roomCode}`);
    if (!rooms[roomCode]) {
      socket.emit("error", { message: "Geçersiz oda kodu." });
      return;
    }
    const participants = rooms[roomCode].participants;
    const questions = rooms[roomCode].questions || [];
    const scores = calculateScores(participants, questions);

    socket.emit("quiz-results", scores);
  });


  function calculateScores(participants, questions) {
    const grouped = {};

    for (const p of participants) {
      if (!grouped[p.name]) grouped[p.name] = [];
      grouped[p.name].push(p);
    }

    const scores = {};

    for (const name in grouped) {
      const candidates = grouped[name];
      const nonEmpty = candidates.filter((p) => Array.isArray(p.answers) && p.answers.length > 0);
      if (nonEmpty.length === 0) continue;

      const best = nonEmpty.reduce((a, b) => (b.answers.length > a.answers.length ? b : a));

      let score = 0;
      const correctAnswers = [];

      // Sayaçlar
      let trueCount = 0;
      let falseCount = 0;
      let unansweredCount = 0;

      for (const [i, question] of questions.entries()) {
        const userAnswer = best.answers.find((a) => a.questionIndex === i + 1);

        if (!userAnswer || userAnswer.answer === null || userAnswer.answer === undefined) {
          correctAnswers.push(null); // cevap boş bırakılmış
          unansweredCount++;
          continue;
        }

        if (userAnswer.answer === question.correctAnswer) {
          score += 10;
          correctAnswers.push(true);
          trueCount++;
        } else {
          score -= 5;
          correctAnswers.push(false);
          falseCount++;
        }
      }

      scores[name] = {
        score,
        true: trueCount,
        false: falseCount,
        unanswered: unansweredCount,
        answers: correctAnswers,
      };
    }

    return scores;
  }



  socket.on("disconnect", () => {
    console.log("İstemci ayrıldı:", socket.id);

    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const index = room.participants.findIndex(p => p.socketId === socket.id);
      if (index !== -1) {
        const disconnectedUser = room.participants[index];
        room.participants.splice(index, 1);

        console.log(`${disconnectedUser.name} odadan ayrıldı: ${roomCode}`);

        io.to(roomCode).emit("update-participants", room.participants.filter(p => !p.isHost));

        const hostExists = room.participants.some(p => p.isHost);
        if (!hostExists) {
          delete rooms[roomCode];
          console.log(`Host odadan ayrıldı, oda silindi: ${roomCode}`);
        }
        break;
      }
    }
  });





});



// Cloudinary üzerinden dosya yükleme (resim/video)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // resim/video neyse otomatik tanır
    });

    fs.unlinkSync(req.file.path); // geçici dosyayı sil

    const payload = {
      url: result.secure_url,
      public_id: result.public_id,
      type: result.resource_type,
    };

    // Socket.IO ile tüm istemcilere yay
    io.emit("new-media", payload);

    res.status(200).json(payload);
  } catch (error) {
    console.error("Cloudinary yükleme hatası:", error);
    res.status(500).json({ error: "Yükleme başarısız." });
  }
});

// Sunucuyu başlat
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
