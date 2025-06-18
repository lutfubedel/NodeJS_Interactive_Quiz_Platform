// socket.js
import { io } from "socket.io-client";

const socket = io("https://nodejsinteractivequizplatform-production.up.railway.app:5050", {
  autoConnect: true, 
});

export default socket;