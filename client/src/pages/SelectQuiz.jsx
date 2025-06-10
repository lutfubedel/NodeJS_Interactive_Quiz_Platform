import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const QuizSelectionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [quizzes, setQuizzes] = useState([]);

  const { userData } = useAuth();
  const isMobile = windowWidth < 640;
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const response = await axios.post("http://localhost:5050/api/list-quizzes", {
        createdBy: userData.name,
      });
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Quizler çekilirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchQuizzes();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectQuiz = (quizId) => {
    navigate(`/start-quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className="flex-1 flex flex-col items-center justify-start pt-10 px-6 relative"
        style={{
          paddingLeft: isMobile ? "10px" : "64px",
          minHeight: "100vh",
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Başlatılacak Quizi Seç</h1>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {quizzes.length === 0 ? (
            <div className="text-center text-white/90 text-lg mt-8">
              Henüz oluşturulmuş bir quiz yok.
            </div>
          ) : (
            quizzes.map((quiz, index) => (
              <div
                key={index}
                className="bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-white/80 mb-1">
                  Konu: <span className="font-medium">{quiz.subject}</span>
                </p>
                <p className="text-sm text-white/80 mb-1">
                  Başlangıç: {new Date(quiz.startDate).toLocaleString()}
                </p>
                <p className="text-sm text-white/80 mb-1">
                  Bitiş: {new Date(quiz.endDate).toLocaleString()}
                </p>
                <p className="text-sm text-white/80 mb-4">
                  Quiz ID: {quiz.quizId}
                </p>

                {/* Seçme Butonu */}
                <button
                  onClick={() => handleSelectQuiz(quiz.quizId)}
                  className="mt-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
                >
                  Quizi Seç
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizSelectionPage;
