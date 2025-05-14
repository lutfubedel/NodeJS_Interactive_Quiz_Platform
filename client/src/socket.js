import { io } from "socket.io-client";

// Sunucunun URL'si ve PORT'u
const socket = io("http://localhost:5050");

export default socket;