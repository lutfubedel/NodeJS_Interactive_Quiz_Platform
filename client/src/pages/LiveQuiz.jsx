import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { useParams, useNavigate } from "react-router-dom";

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
    return <div className="waiting">Quiz’in başlaması bekleniyor...</div>;
  }

  if (!question) {
    return <div className="loading">Soru yükleniyor...</div>;
  }

  return (
    <div className="live-quiz">
      <h2>Soru {questionIndex}</h2>
      <p>{question.question}</p>

      {question.image && (
        <img
          src={question.image}
          alt="Soru görseli"
          style={{ maxWidth: "300px", marginBottom: "1rem" }}
        />
      )}

      <ul>
        {question.options.map((option, i) => (
          <li
            key={i}
            onClick={() => setSelectedOption(option)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedOption === option ? "#cce5ff" : "#fff",
              padding: "8px",
              margin: "4px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {option}
          </li>
        ))}
      </ul>

      <p>Kalan süre: {timeLeft} saniye</p>
    </div>
  );
};

export default LiveQuiz;
