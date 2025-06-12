import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

const QuizRoom = ({ isHost }) => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth(); // Sadece buradan geliyor artık
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {


  if (isHost) return; // Host zaten StartQuiz'te katıldı
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
      <div className="text-red-600 text-center mt-10">
        Hata: {error}
        <br />
        <button onClick={() => navigate("/joinquiz")} className="mt-4 underline">
          Tekrar dene
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Oda Kodu: {roomCode}</h1>

      <h2 className="text-xl font-semibold mb-3">Katılımcılar:</h2>
      <ul className="mb-6 list-disc list-inside">
        {participants.length === 0 ? (
          <li>Henüz kimse katılmadı.</li>
        ) : (
          participants.map((p, index) => (
            <li key={p?.socketId || index}>{p?.name || "İsimsiz Katılımcı"}</li>
          ))
        )}
      </ul>

      {isHost && (
        <button
          onClick={startQuiz}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Quizi Başlat
        </button>
      )}
    </div>
  );
};

export default QuizRoom;
