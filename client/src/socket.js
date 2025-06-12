// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5050", {
  autoConnect: true, 
});

export default socket;