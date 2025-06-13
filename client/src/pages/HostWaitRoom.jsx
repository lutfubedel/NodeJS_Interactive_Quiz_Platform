import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

const HostWaitRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Quiz başladığında süre başlasın
    socket.on("new-question", ({ timeLimit }) => {
      if (!quizStarted) setQuizStarted(true);
      setTimeLeft(timeLimit);
    });

    // Her yeni soru geldiğinde süre sıfırlansın
    socket.on("new-question", ({ timeLimit }) => {
      setTimeLeft(timeLimit);
    });

    socket.on("quiz-finished", () => {
      setQuizFinished(true);
      setTimeout(() => {
        navigate(`/results/${roomCode}`);
      }, 3000); // 3 saniye sonra sonuçlara yönlendir
    });

    return () => {
      socket.off("new-question");
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

  if (quizFinished) {
    return <div className="host-room">Quiz bitti, sonuçlara yönlendiriliyorsunuz...</div>;
  }

  if (!quizStarted) {
    return <div className="host-room">Quiz’in başlaması bekleniyor...</div>;
  }

  return (
    <div className="host-room">
      <h2>Quiz Başladı</h2>
      <p>Kalan süre: {timeLeft} saniye</p>
    </div>
  );
};

export default HostWaitRoom;
