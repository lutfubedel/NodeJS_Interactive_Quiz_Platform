import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import routers from './routes/record.js';
import { ObjectId } from 'mongodb';
import { connectToMongo } from './routes/record.js'

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
  //  startQuizFlow(roomCode);
  console.log(getQuizQuestions(rooms[roomCode].quizId));
  }
});



const startQuizFlow = async (roomCode) => {
  const quizId = rooms[roomCode].quizId;
  const quizData = await getQuizFromDatabase(quizId); // Quiz sorularını al

  const questions = quizData.questions;
  let currentIndex = 0;

  const askNextQuestion = () => {
    if (currentIndex >= questions.length) {
      io.to(roomCode).emit("quiz-finished");
      saveResultsToDatabase(rooms[roomCode]); // tüm cevapları kaydet
      return;
    }

    const currentQuestion = questions[currentIndex];
    io.to(roomCode).emit("new-question", {
      index: currentIndex + 1,
      question: currentQuestion,
      timeLimit: 30,
    });

    // 30 saniye sonra cevapları işle ve bir sonrakine geç
    setTimeout(() => {
      currentIndex++;
      askNextQuestion();
    }, 30000);
  };

  askNextQuestion();
};


async function getQuizQuestions(quizId) {
  if (!quizId) throw new Error("quizId gereklidir");

  const db = await connectToMongo();
  const quizzes = db.collection('quizes');

  // quizId ile quizi bul
  const quiz = await quizzes.findOne({ quizId: quizId });

  if (!quiz) {
    throw new Error("Quiz bulunamadı");
  }

  // quiz.questions varsa döndür, yoksa boş dizi
  return quiz.questions || [];
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
