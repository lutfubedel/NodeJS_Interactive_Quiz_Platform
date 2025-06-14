import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const formatDate = (isoString) => {
  if (!isoString) return "Tarih yok";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const JoinedQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchJoinedQuizzes = async () => {
      if (!userData?.name) return;

      try {
        const response = await axios.post("http://localhost:5050/api/quiz-results-by-name", {
          name: userData.name,
        });

        const formattedQuizzes = await Promise.all(
          response.data.results.map(async (item) => {
            const scoresEntries = Object.entries(item.scores || {});

            // Skorları azalan sıraya göre sırala
            scoresEntries.sort((a, b) => (b[1].score ?? 0) - (a[1].score ?? 0));

            const userIndex = scoresEntries.findIndex(
              ([username]) => username.toLowerCase() === userData.name.toLowerCase()
            );
            const userRank = userIndex !== -1 ? userIndex + 1 : null;
            const userScoreObj = userIndex !== -1 ? scoresEntries[userIndex][1] : null;

            const scoresCount = scoresEntries.length;

            // 🧠 Quiz başlığını quizId ile çek
            let quizTitle = "Bilinmeyen Quiz";
            let quizDate = formatDate(item.timestamp);
            
            console.log("response" + item.quizId)
            try {
              const quizRes = await axios.post("http://localhost:5050/api/get-quiz-by-id", {
                quizId: item.quizId,
              });

              if (quizRes.data?.title) {
                quizTitle = quizRes.data.title;
              }
              if (quizRes.data?.timestamp) {
                quizDate = formatDate(quizRes.data.timestamp);
              }
            } catch (err) {
              console.warn("Quiz başlığı alınamadı:", err);
            }

            return {
              id: item._id,
              title: quizTitle,
              date: quizDate,
              score: userScoreObj?.score ?? null,
              rank: userRank,
              totalParticipants:
                item.participantCount === scoresCount ? item.participantCount : scoresCount,
              status: "Tamamlandı",
            };
          })
        );

        setQuizzes(formattedQuizzes);
      } catch (error) {
        console.error("Katıldığı quizler alınamadı:", error);
      }
    };

    fetchJoinedQuizzes();
  }, [userData]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 text-white">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-10 p-6 sm:p-10">
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
              <p className="text-sm mb-1">🧑‍🤝‍🧑 Katılımcı: {quiz.totalParticipants}</p>
              <p className="text-sm mb-1">
                🏅 Puan: {quiz.score !== null ? quiz.score : "Bekleniyor"}
              </p>
              <p className="text-sm mb-1">
                🔢 Sıralama: {quiz.rank !== null ? `#${quiz.rank}` : "Henüz Yok"}
              </p>
              <p className="text-sm font-medium mt-3 text-green-300">
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
