import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { motion, AnimatePresence } from "framer-motion";

// Scoreboard bileşeni
const ScoreboardPanel = ({ users = [] }) => {
  // Skora göre azalan sırala
  const sortedUsers = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Canlı Skor Tablosu</h3>
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
        {sortedUsers.length === 0 ? (
          <p className="text-white text-center">Katılımcıların Cevapları Bekleniyor.</p>
        ) : (
          sortedUsers.map((user, idx) => (
            <div
              key={user.id || user.socketId || idx}
              className="flex items-center bg-white/10 text-white rounded-lg p-2 shadow-md overflow-hidden"
            >
              {/* Skor */}
              <div className="w-12 text-center font-bold text-lg">{user.score ?? 0}</div>

              {/* Avatar */}
              <img
                src={user.avatar || `https://i.pravatar.cc/40?u=${user.name}`}
                alt={user.name}
                className="w-10 h-10 rounded-full mx-3 border-2 border-white"
              />

              {/* İsim ve Skor */}
              <div className="min-w-[140px] font-medium flex flex-col">
                <span>{user.name || "İsimsiz"}</span>
                <small className="text-sm text-gray-300">Skor: {user.score ?? 0}</small>
              </div>

              {/* Cevaplar */}
              <div className="flex items-center gap-2 overflow-hidden pl-4">
                <span className="text-white text-sm font-semibold shrink-0">Cevaplar:</span>
                <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent pr-1">
                  {(Array.isArray(user.answers) ? user.answers : []).map((correct, index) => {
                    // correct === true -> doğru (yeşil)
                    // correct === false -> yanlış (kırmızı)
                    // null/undefined/başka -> boş (gri)
                    const bgColor = correct === true ? "bg-green-500" : correct === false ? "bg-red-500" : "bg-gray-500";
                    const title = `${index + 1}. Soru - ${
                      correct === true ? "Doğru ✅" : correct === false ? "Yanlış ❌" : "Boş -"
                    }`;
                    return (
                      <div
                        key={index}
                        title={title}
                        className={`min-w-[32px] h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${bgColor} text-white hover:scale-110 cursor-help shadow-md`}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const HostWaitRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [scoreboardData, setScoreboardData] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleNewQuestion = ({ timeLimit }) => {
      if (!quizStarted) setQuizStarted(true);
      setTimeLeft(timeLimit);
      setQuestionNumber((prev) => prev + 1);
    };

    const handleScoreboardUpdate = (data) => {
      console.log("Gelen scoreboard verisi:", data);
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        // Nesneyse içindeki user objelerini dizi olarak al
        setScoreboardData(Object.values(data));
      } else if (Array.isArray(data)) {
        setScoreboardData(data);
      } else {
        console.warn("Geçersiz skor verisi:", data);
      }
    };

    const handleQuizFinished = () => {
      setQuizFinished(true);
      navigate(`/results/${roomCode}`);
    };


    socket.on("new-question", handleNewQuestion);
    socket.on("update-scoreboard", handleScoreboardUpdate);
    socket.on("quiz-finished", handleQuizFinished);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("update-scoreboard", handleScoreboardUpdate);
      socket.off("quiz-finished", handleQuizFinished);
    };
  }, [quizStarted, navigate, roomCode]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-6">
      <AnimatePresence>
        {quizFinished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold">Quiz bitti</h2>
            <p className="mt-2 text-sm">Sonuçlara yönlendiriliyorsunuz...</p>
          </motion.div>
        ) : !quizStarted ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center p-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <h2 className="text-2xl font-semibold">Katılımcılar bekleniyor...</h2>
            <p className="text-sm">Quiz yakında başlayacak</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              key="started"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center p-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md"
            >
              <h2 className="text-3xl font-bold mb-4">Quiz Başladı 🎉</h2>
              <p className="text-lg">
                {questionNumber}. soru için kalan süre:{" "}
                <span className="font-mono font-semibold">{timeLeft}</span> saniye
              </p>
            </motion.div>

            {/* Scoreboard paneli */}
            <ScoreboardPanel users={scoreboardData} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostWaitRoom;
