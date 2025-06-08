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

// Socket.IO bağlantısı
io.on("connection", (socket) => {
  console.log("Yeni istemci bağlandı:", socket.id);
  socket.emit("connected", { message: "Socket.IO bağlantısı başarılı!" });

  socket.on("disconnect", () => {
    console.log("İstemci ayrıldı:", socket.id);
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
