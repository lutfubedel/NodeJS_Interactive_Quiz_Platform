import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

const Results = () => {
  const { roomCode } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Sonuçları sunucudan al
    socket.emit("get-results", { roomCode });

    socket.on("quiz-results", (data) => {
      setResults(data);
    });

    return () => {
      socket.off("quiz-results");
    };
  }, [roomCode]);

  if (!results) {
    return <div className="text-center p-6">Sonuçlar yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Sonuçları</h1>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4">
        <ul>
          {results.map((user, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <span>{user.name || "İsimsiz Katılımcı"}</span>
              <span className="font-bold">{user.score} puan</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;
