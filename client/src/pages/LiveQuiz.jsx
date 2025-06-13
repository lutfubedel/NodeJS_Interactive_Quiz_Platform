import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LiveQuiz = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate(); // yönlendirme için
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    socket.on("quiz-starting", ({ countdown }) => {
      console.log(`Quiz ${countdown} saniye içinde başlayacak.`);
      setQuizStarted(false);
    });

    socket.on("quiz-started", () => {
      setQuizStarted(true);
    });

    socket.on("new-question", ({ index, question, timeLimit }) => {
      setQuestion(question);
      setQuestionIndex(index);
      setTimeLeft(timeLimit);
      setSelectedOption(null);
    });

    socket.on("quiz-finished", () => {
      navigate(`/results/${roomCode}`);
    });

    return () => {
      socket.off("quiz-starting");
      socket.off("quiz-started");
      socket.off("new-question");
      socket.off("quiz-finished");
    };
  }, [navigate]);

  useEffect(() => {
    if (timeLeft === 0 && question) {
      submitAnswer();
    }

    if (timeLeft > 0 && question) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, question]);

  const submitAnswer = () => {
    socket.emit("submit-answer", {
      roomCode,
      answer: selectedOption,
      questionIndex,
    });
    console.log("Cevap gönderildi:", selectedOption);
  };

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-6"
      >
        {/* Dönen loading simgesi */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/100 border-t-transparent rounded-full mb-6"
        />

        {/* Fade ve scale animasyonlu metin */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl font-semibold text-center"
        >
          Quiz’in başlaması bekleniyor...
        </motion.div>
      </motion.div>
    );
  }

  if (!question) {
    return <div className="loading">Soru yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        {/* Kalan Süre - üstte */}
        <div className="text-center text-sm font-mono mb-4">
          ⏳ Kalan süre :{" "}
          {timeLeft <= 5 ? (
            <motion.span
              className="text-lg font-bold text-red-500 inline-block"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              {timeLeft} saniye
            </motion.span>
          ) : (
            <span className="text-lg font-bold text-white">
              {timeLeft} saniye
            </span>
          )}
        </div>

        {/* Panel içi: Soru ve Şıklar (ANİMASYONLU) */}
        <motion.div
          key={questionIndex} // her soru değişiminde animasyonu tetikler
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 border-t border-white/30 pt-6"
        >
          {/* Sol Panel: Soru ve Görsel */}
          <div className="pr-4 border-r border-white/30">
            <h2 className="text-2xl font-semibold mb-4">
              Soru {questionIndex}
            </h2>
            <p className="text-white text-lg">{question.question}</p>

            {question.image && (
              <img
                src={question.image}
                alt="Soru görseli"
                className="mt-4 max-h-64 w-full object-contain rounded-lg shadow"
              />
            )}
          </div>

          {/* Sağ Panel: Şıklar */}
          <div className="pl-4 flex flex-col gap-3">
            {question.options.map((option, i) => (
              <motion.div
                key={i}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                onClick={() => setSelectedOption(option)}
                className={`cursor-pointer p-3 rounded-lg border border-white/30 transition-all duration-200 text-sm text-white
              ${
                selectedOption === option
                  ? "bg-blue-500 font-semibold scale-105"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              >
                {option}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveQuiz;
