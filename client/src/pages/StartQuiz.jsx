import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const generateRoomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const StartQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate(); // Yönlendirme için
  const { userData } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);

    const hostName = userData.name;

    socket.emit("host-join-room", {
      roomCode: newCode,
      hostName,
      quizId,
    });

    const handleUpdate = (users) => {
      setParticipants(users);
    };

    socket.on("update-participants", handleUpdate);

    return () => {
      socket.off("update-participants", handleUpdate);
    };
  }, [quizId, userData.name]);

  const handleStartQuiz = () => {
    console.log("Quiz başlatılıyor:", roomCode);
    socket.emit("start-quiz", { roomCode });
    navigate(`/host/${roomCode}`); // HostWaitRoom'a yönlendir
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-xl"
      >
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
          Canlı Quiz Başlatılıyor
        </h1>

        <p className="text-lg mb-1">
          Quiz ID: <span className="font-semibold">{quizId}</span>
        </p>

        <div className="bg-white text-indigo-700 text-3xl font-mono px-6 py-2 rounded-xl shadow-md mb-6">
          Oda Kodu: {roomCode}
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-lg p-4 w-full mb-6 shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-2">Katılanlar:</h2>
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent pr-2">
            <AnimatePresence>
              {participants.length === 0 ? (
                <motion.p
                  key="no-participants"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80"
                >
                  Henüz katılımcı yok.
                </motion.p>
              ) : (
                <motion.ul
                  key="participants-list"
                  className="list-disc pl-5 space-y-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  {participants.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {p.name || "İsimsiz Katılımcı"}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.button
          onClick={handleStartQuiz}
          className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-100 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Quiz’i Başlat
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartQuiz;
