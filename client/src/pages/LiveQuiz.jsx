import React, { useEffect, useState, useRef } from "react";
import socket from "../socket"; // merkezi socket bağlantın
import { useParams } from "react-router-dom";

const LiveQuiz = () => {
  const { roomCode } = useParams(); // URL'den roomCode alınır
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const timerRef = useRef(null);

  // Sayaç işleyicisi
  useEffect(() => {
    if (timeLeft === 0 && question) {
      submitAnswer(); // zaman dolunca cevap gönder
    }

    if (timeLeft > 0 && question) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, question]);

  useEffect(() => {
    socket.on("quiz-started", () => {
      console.log("Quiz başladı");
      setQuizStarted(true);
    });

    socket.on("new-question", ({ index, question, timeLimit }) => {
      console.log("Yeni soru:", question);
      setQuestion(question);
      setQuestionIndex(index);
      setTimeLeft(timeLimit);
      setSelectedOption(null); // önceki seçimi temizle
    });

    socket.on("quiz-finished", () => {
      console.log("Quiz bitti");
      setQuizFinished(true);
    });

    return () => {
      socket.off("quiz-started");
      socket.off("new-question");
      socket.off("quiz-finished");
    };
  }, []);

  const submitAnswer = () => {
    socket.emit("submit-answer", {
      roomCode,
      answer: selectedOption,
      questionIndex,
    });
    console.log("Cevap gönderildi:", selectedOption);
  };

  if (quizFinished) {
    return <div className="quiz-finished">Quiz bitti! Teşekkürler.</div>;
  }

  if (!quizStarted) {
    return <div className="waiting">Quiz'in başlaması bekleniyor...</div>;
  }

  if (!question) {
    return <div className="loading">Soru yükleniyor...</div>;
  }

  return (
    <div className="live-quiz">
      <h2>Soru {questionIndex}</h2>
      <p>{question.text}</p>

      <ul>
        {question.options.map((option, i) => (
          <li
            key={i}
            onClick={() => setSelectedOption(option)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedOption === option ? "#ddd" : "#fff",
            }}
          >
            {option}
          </li>
        ))}
      </ul>

      <p>Kalan süre: {timeLeft} saniye</p>
      {!selectedOption && <p>Bir seçenek seçin...</p>}
    </div>
  );
};

export default LiveQuiz;