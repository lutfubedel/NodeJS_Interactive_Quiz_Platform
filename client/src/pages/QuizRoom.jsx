import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const QuizRoom = ({ isHost }) => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isHost) return;

    socket.emit("join-room", {
      roomCode,
      participant: { name: userData?.name || "Misafir" },
    });

    const handleUpdateParticipants = (list) => {
      setParticipants(list);
    };

    const handleUserJoined = (user) => {
      console.log("Yeni katılımcı geldi:", user.name);
    };

    const handleQuizStarted = () => {
      navigate(`/live-quiz/${roomCode}`);
    };

    const handleError = (data) => {
      setError(data.message || "Bilinmeyen bir hata oluştu.");
    };

    socket.on("update-participants", handleUpdateParticipants);
    socket.on("user-joined", handleUserJoined);
    socket.on("quiz-started", handleQuizStarted);
    socket.on("error", handleError);

    return () => {
      socket.off("update-participants", handleUpdateParticipants);
      socket.off("user-joined", handleUserJoined);
      socket.off("quiz-started", handleQuizStarted);
      socket.off("error", handleError);
    };
  }, [roomCode, isHost, userData, navigate]);

  const startQuiz = () => {
    socket.emit("start-quiz", { roomCode });
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-500 to-red-700 text-white px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Hata</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate("/joinquiz")}
            className="bg-white text-red-700 px-5 py-2 rounded-full font-semibold hover:bg-red-100 transition"
          >
            Tekrar Dene
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-center">
          Oda Kodu: <span className="font-mono">{roomCode}</span>
        </h1>

        <h2 className="text-xl font-semibold mb-3">Katılımcılar:</h2>

        <div className="mb-6 bg-white/5 p-4 rounded-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
          <AnimatePresence>
            {participants.length === 0 ? (
              <motion.p
                key="no-participants"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/80"
              >
                Henüz kimse katılmadı.
              </motion.p>
            ) : (
              <motion.ul
                key="participants-list"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="list-disc pl-6 space-y-1"
              >
                {participants.map((p, index) => (
                  <motion.li
                    key={p?.socketId || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    {p?.name || "İsimsiz Katılımcı"}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {isHost && (
          <motion.button
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block w-full text-center bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow hover:bg-indigo-100 transition"
          >
            Quizi Başlat
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default QuizRoom;
