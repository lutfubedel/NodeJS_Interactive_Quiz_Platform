import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const QuizRoom = ({ userData, isHost }) => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5050");

    if (isHost) {
      socket.emit("host-join-room", { roomCode, hostName: userData?.name || "Host" });
    } else {
      socket.emit("join-room", { roomCode, participant: { name: userData?.name || "Misafir" } });
    }

    socket.on("update-participants", (list) => {
      setParticipants(list);
    });

    socket.on("user-joined", (user) => {
      console.log("Yeni katılımcı geldi:", user.name);
      // İstersen burada bildirim gösterebilirsin
    });

    socket.on("error", (data) => {
      setError(data.message || "Bilinmeyen bir hata oluştu.");
    });

    socket.on("quiz-started", () => {
      navigate(`/live-quiz/${roomCode}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, isHost, userData, navigate]);

  const startQuiz = () => {
    const socket = io("http://localhost:5050");
    socket.emit("start-quiz", { roomCode });
    socket.disconnect();
  };

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        Hata: {error}
        <br />
        <button onClick={() => navigate("/join-quiz")} className="mt-4 underline">
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
