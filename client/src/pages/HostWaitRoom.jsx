import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { motion, AnimatePresence } from "framer-motion";

// Örnek kullanıcı verisi (ileride socket ile güncellenebilir)
const sampleUsers = [
  {
    id: 1,
    name: "Ahmet Yıldız",
    avatar: "https://i.pravatar.cc/40?u=ahmet",
    score: Math.floor(Math.random() * 100),
    answers: Array.from({ length: 20 }, () => Math.random() < 0.5),
  },
  {
    id: 2,
    name: "Zeynep Kara",
    avatar: "https://i.pravatar.cc/40?u=zeynep",
    score: Math.floor(Math.random() * 100),
    answers: Array.from({ length: 20 }, () => Math.random() < 0.5),
  },
  {
    id: 3,
    name: "Mehmet Ak",
    avatar: "https://i.pravatar.cc/40?u=mehmet",
    score: Math.floor(Math.random() * 100),
    answers: Array.from({ length: 20 }, () => Math.random() < 0.5),
  },
];

// Scoreboard bileşeni
const ScoreboardPanel = ({ users = sampleUsers }) => {
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">
        Canlı Skor Tablosu
      </h3>
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-white/10 text-white rounded-lg p-2 shadow-md overflow-hidden"
          >
            {/* Skor */}
            <div className="w-12 text-center font-bold text-lg">
              {user.score}
            </div>

            {/* Profil Resmi */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full mx-3 border-2 border-white"
            />

            {/* Kullanıcı Adı */}
            <span className="min-w-[120px] font-medium">{user.name}</span>

            <div className="flex items-center gap-2 overflow-hidden pl-4">
              {/* Sabit metin */}
              <span className="text-white text-sm font-semibold shrink-0">
                Cevaplar:
              </span>

              {/* Scrollable daireler */}
              <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent pr-1">
                {user.answers.map((correct, index) => (
                  <div
                    key={index}
                    title={`${index + 1}. Soru - ${
                      correct ? "Doğru ✅" : "Yanlış ❌"
                    }`}
                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
          ${correct ? "bg-green-500" : "bg-red-500"}
          text-white hover:scale-110 cursor-help shadow-md`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Ana bileşen
const HostWaitRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleNewQuestion = ({ timeLimit }) => {
      if (!quizStarted) setQuizStarted(true);
      setTimeLeft(timeLimit);
      setQuestionNumber((prev) => prev + 1);
    };

    socket.on("new-question", handleNewQuestion);

    socket.on("quiz-finished", () => {
      setQuizFinished(true);
      setTimeout(() => {
        navigate(`/results/${roomCode}`);
      }, 3000);
    });

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("quiz-finished");
    };
  }, [navigate, quizStarted, roomCode]);

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
            <h2 className="text-2xl font-semibold">
              Katılımcılar bekleniyor...
            </h2>
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
                <span className="font-mono font-semibold">{timeLeft}</span>{" "}
                saniye
              </p>
            </motion.div>

            {/* Scoreboard paneli */}
            <ScoreboardPanel />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostWaitRoom;
