import express from "express";
import cors from "cors";
import records from "./routes/record.js"; // 🔧 Uzantı eklendi
import dotenv from "dotenv";
import http from "http"; 
import { Server } from "socket.io"; 


dotenv.config();

const PORT = process.env.VITE_PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

