import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../Components/Sidebar"; // Yolunu kendi projenle eşleştir

const sampleQuizzes = [
  {
    id: 1,
    title: "Genel Kültür Yarışması",
    date: "2025-05-12",
    score: 85,
    rank: 12,
    totalParticipants: 128,
    status: "Tamamlandı",
  },
  {
    id: 2,
    title: "JavaScript Temelleri",
    date: "2025-05-25",
    score: 72,
    rank: 5,
    totalParticipants: 45,
    status: "Tamamlandı",
  },
  {
    id: 3,
    title: "Tarih Bilgisi Testi",
    date: "2025-06-01",
    score: null,
    rank: null,
    totalParticipants: 78,
    status: "Devam Ediyor",
  },
];

const JoinedQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(sampleQuizzes); // Buraya API'den veri çekme de eklenebilir
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 sm:ml-10 p-6 sm:p-10 ">
        <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
          Katıldığım Quizler
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-md hover:scale-[1.1] hover:bg-white/30 transition text-white duration-100"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-sm mb-1">📅 Tarih: {quiz.date}</p>
              <p className="text-sm mb-1">
                🧑‍🤝‍🧑 Katılımcı: {quiz.totalParticipants}
              </p>
              <p className="text-sm mb-1">
                🏅 Puan: {quiz.score !== null ? quiz.score : "Bekleniyor"}
              </p>
              <p className="text-sm mb-1">
                🔢 Sıralama:{" "}
                {quiz.rank !== null ? `#${quiz.rank}` : "Henüz Yok"}
              </p>
              <p
                className={`text-sm font-medium mt-3 ${
                  quiz.status === "Tamamlandı"
                    ? "text-green-300"
                    : "text-yellow-300"
                }`}
              >
                ⏳ Durum: {quiz.status}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JoinedQuizzesPage;
