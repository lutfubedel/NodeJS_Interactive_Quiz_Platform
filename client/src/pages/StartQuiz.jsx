import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050"); // Gerekirse .env ile taşı

const generateRoomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const StartQuiz = () => {
  const { quizId } = useParams();
  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);

    // Host adı örnek olarak "HostUser", bunu gerçek kullanıcı adıyla değiştir
    const hostName = "HostUser";

    // Host oda oluşturuyor
    socket.emit("host-join-room", { roomCode: newCode, hostName });

    // Katılımcı listesi güncellendiğinde al
    socket.on("update-participants", (users) => {
      setParticipants(users);
    });

    // Cleanup - event listenerları kaldır, bağlantıyı kapatma
    return () => {
      socket.off("update-participants");
    };
  }, [quizId]);

  const handleStartQuiz = () => {
    socket.emit("start-quiz", { roomCode });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Canlı Quiz Başlatılıyor</h1>
      <p className="text-lg mb-2">Quiz ID: {quizId}</p>
      <p className="text-lg mb-6">
        Oda Kodu: <span className="font-mono text-2xl">{roomCode}</span>
      </p>

      <div className="bg-white/10 rounded-lg p-4 w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Katılanlar:</h2>
        {participants.length === 0 ? (
          <p>Henüz katılımcı yok.</p>
        ) : (
          <ul className="list-disc pl-5">
            {participants.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleStartQuiz}
        className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold hover:bg-indigo-100 transition"
      >
        Quiz’i Başlat
      </button>
    </div>
  );
};

export default StartQuiz;
