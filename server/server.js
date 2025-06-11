import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import routers from './routes/record.js';

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

  socket.on("host-join-room", ({ roomCode, hostName }) => {
    if (!roomCode || !hostName) {
      socket.emit("error", { message: "Oda kodu ve host adı gereklidir." });
      return;
    }
    socket.join(roomCode);
    rooms[roomCode] = [{ socketId: socket.id, name: hostName, isHost: true }];

    console.log(`Host oda oluşturdu: ${roomCode} (${hostName})`);
    io.to(roomCode).emit("update-participants", rooms[roomCode]);
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
    rooms[roomCode].push({ socketId: socket.id, name: participantName, isHost: false });

    console.log(`Katılımcı katıldı: ${participantName} -> ${roomCode}`);

    // Yeni katılan kişiyi yayınla:
    io.to(roomCode).emit("user-joined", { name: participantName, socketId: socket.id });

    // Güncel katılımcı listesini güncelle
    io.to(roomCode).emit("update-participants", rooms[roomCode]);
  });

  socket.on("start-quiz", ({ roomCode }) => {
    if (!roomCode || !rooms[roomCode]) {
      socket.emit("error", { message: "Geçersiz oda kodu." });
      return;
    }
    console.log(`Quiz başlatıldı: ${roomCode}`);
    io.to(roomCode).emit("quiz-started");
  });

  socket.on("disconnect", () => {
    console.log("İstemci ayrıldı:", socket.id);

    for (const roomCode in rooms) {
      const index = rooms[roomCode].findIndex(p => p.socketId === socket.id);
      if (index !== -1) {
        const disconnectedUser = rooms[roomCode][index];
        rooms[roomCode].splice(index, 1);

        console.log(`${disconnectedUser.name} odadan ayrıldı: ${roomCode}`);

        io.to(roomCode).emit("update-participants", rooms[roomCode]);

        const hostExists = rooms[roomCode].some(p => p.isHost);
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
