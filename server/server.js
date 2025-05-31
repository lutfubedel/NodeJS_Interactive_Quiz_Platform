import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; 
import { Server } from "socket.io"; 
import routers from './routes/record.js';


dotenv.config();

const PORT = process.env.VITE_PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routers);

// HTTP sunucusu oluştur (Express'i içine alarak)
const server = http.createServer(app);


// Socket.IO'yu HTTP sunucusuna bağla
const io = new Server(server, {
  cors: {
    origin: "*", // Geliştirme için açık tut
  },
});

// Bir kullanıcı bağlandığında
io.on("connection", (socket) => {
  console.log("Yeni istemci bağlandı:", socket.id);

  // Test mesajı gönder
  socket.emit("connected", { message: "Socket.IO bağlantısı başarılı!" });

  socket.on("disconnect", () => {
    console.log("İstemci ayrıldı:", socket.id);
  });
});
 


// Sunucuyu başlat
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

