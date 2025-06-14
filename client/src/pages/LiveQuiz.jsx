import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LiveQuiz = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);

  // Ref: cevap gönderildi mi kontrolü için
  const hasSubmittedRef = useRef(false);
  // Ref: kullanıcının seçtiği seçenek
  const selectedOptionRef = useRef(null);
  // Ref: mevcut soru indeksi
  const questionIndexRef = useRef(0);
  // Timer referansları
  const countdownIntervalRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    // Quiz başlama geri bildirimi
    socket.on("quiz-starting", ({ countdown }) => {
      console.log(`Quiz ${countdown} saniye içinde başlayacak.`);
      setQuizStarted(false);
    });

    socket.on("quiz-started", () => {
      console.log("Quiz başladı");
      setQuizStarted(true);
    });

    // Yeni soru geldiğinde
    socket.on("new-question", ({ index, question, timeLimit }) => {
      console.log(`Yeni soru: ${index}`, question);

      // Önceki timerlar temizlenir
      clearInterval(countdownIntervalRef.current);
      clearTimeout(submitTimeoutRef.current);

      // Durumlar güncellenir
      setQuestion(question);
      setQuestionIndex(index);
      questionIndexRef.current = index;

      setTimeLeft(timeLimit);
      setSelectedOption(null);
      selectedOptionRef.current = null;
      hasSubmittedRef.current = false;

      // Geri sayım başlatılır
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Süre dolduğunda otomatik cevap gönder
      submitTimeoutRef.current = setTimeout(() => {
        console.log("Süre doldu, cevap gönderiliyor...");
        submitAnswer();
      }, timeLimit * 1000);
    });

    // Quiz bittiğinde yönlendirme
    socket.on("quiz-finished", () => {
      clearInterval(countdownIntervalRef.current);
      clearTimeout(submitTimeoutRef.current);
      navigate(`/results/${roomCode}`);
    });

    // Cleanup
    return () => {
      socket.off("quiz-starting");
      socket.off("quiz-started");
      socket.off("new-question");
      socket.off("quiz-finished");

      clearInterval(countdownIntervalRef.current);
      clearTimeout(submitTimeoutRef.current);
    };
  }, [navigate, roomCode]);

  // Seçenek tıklama
  const handleOptionClick = (optionIndex) => {
    if (hasSubmittedRef.current) return; // Cevap zaten gönderilmişse engelle

    setSelectedOption(optionIndex);
    selectedOptionRef.current = optionIndex;  // burayı ekle
  };

  // Cevap gönderme fonksiyonu
  const submitAnswer = () => {
    if (hasSubmittedRef.current) {
      console.log("Cevap zaten gönderilmiş.");
      return;
    }

    hasSubmittedRef.current = true;

    // Burada state değil ref kullan
    const currentSelected = selectedOptionRef.current;
    let answerChar = null;

    if (currentSelected !== null && typeof currentSelected !== "undefined") {
      answerChar = String.fromCharCode(65 + currentSelected); // 0 -> A, 1 -> B, ...
    }

    console.log(`Cevap gönderiliyor: Soru ${questionIndexRef.current} - Cevap: ${answerChar ?? "null"}`);

    socket.emit("submit-answer", {
      roomCode,
      answer: answerChar,
      questionIndex: questionIndexRef.current,
    });
  };


  // Quiz başlamadan gösterilecek ekran
  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/100 border-t-transparent rounded-full mb-6"
        />
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

  // Soru yükleniyorsa
  if (!question) {
    return <div className="loading text-white text-center mt-20">Soru yükleniyor...</div>;
  }

  // Ana quiz ekranı
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
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
            <span className="text-lg font-bold text-white">{timeLeft} saniye</span>
          )}
        </div>

        <motion.div
          key={questionIndex}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 border-t border-white/30 pt-6"
        >
          <div className="pr-4 border-r border-white/30">
            <h2 className="text-2xl font-semibold mb-4">Soru {questionIndex}</h2>
            <p className="text-white text-lg">{question.question}</p>

            {question.image && (
              <img
                src={question.image}
                alt="Soru görseli"
                className="mt-4 max-h-64 w-full object-contain rounded-lg shadow"
              />
            )}
          </div>

          <div className="pl-4 flex flex-col gap-3">
            {question.options.map((option, i) => (
              <motion.div
                key={i}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                onClick={() => handleOptionClick(i)}
                className={`cursor-pointer p-3 rounded-lg border border-white/30 transition-all duration-200 text-sm text-white
                ${
                  selectedOption === i
                    ? "bg-blue-500 font-semibold scale-105"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <strong>{String.fromCharCode(65 + i)}.</strong> {option}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveQuiz;
