import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

// HostWaitRoom'daki ScoreboardPanel aynen alındı
const ScoreboardPanel = ({ users = [] }) => {
  const sortedUsers = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Quiz Sonuçları</h3>
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
        {sortedUsers.length === 0 ? (
          <p className="text-white text-center">Sonuç bulunamadı.</p>
        ) : (
          sortedUsers.map((user, idx) => (
            <div
              key={user.id || user.socketId || idx}
              className="flex items-center bg-white/10 text-white rounded-lg p-2 shadow-md overflow-hidden"
            >
              <div className="w-12 text-center font-bold text-lg">{user.score ?? 0}</div>

              <img
                src={user.avatar || `https://i.pravatar.cc/40?u=${user.name}`}
                alt={user.name}
                className="w-10 h-10 rounded-full mx-3 border-2 border-white"
              />

              <div className="min-w-[140px] font-medium flex flex-col">
                <span>{user.name || "İsimsiz"}</span>
                <small className="text-sm text-gray-300">Skor: {user.score ?? 0}</small>
              </div>

              <div className="flex items-center gap-2 overflow-hidden pl-4">
                <span className="text-white text-sm font-semibold shrink-0">Cevaplar:</span>
                <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent pr-1">
                  {(Array.isArray(user.answers) ? user.answers : []).map((correct, index) => {
                    const bgColor =
                      correct === true
                        ? "bg-green-500"
                        : correct === false
                        ? "bg-red-500"
                        : "bg-gray-500";
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

const Results = () => {
  const { roomCode } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.emit("get-results", { roomCode });

    socket.on("quiz-results", (data) => {
      console.log("Quiz sonuçları geldi:", data);
      if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        setResults(Object.values(data));
      } else {
        setResults(data);
      }
    });

    return () => {
      socket.off("quiz-results");
    };
  }, [roomCode]);

  if (!results) {
    return (
      <div className="text-center p-6 text-white bg-indigo-600 min-h-screen flex items-center justify-center">
        <p>Sonuçlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Sonuçları</h1>
      <ScoreboardPanel users={results} />
    </div>
  );
};

export default Results;
