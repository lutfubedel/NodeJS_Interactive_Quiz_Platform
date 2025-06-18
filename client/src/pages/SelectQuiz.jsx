import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const QuizSelectionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [quizzes, setQuizzes] = useState([]);
  const { userData } = useAuth();
  const isMobile = windowWidth < 640;
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const response = await axios.post(
        "https://nodejsinteractivequizplatform-production.up.railway.app:5050/api/list-quizzes",
        {
          createdBy: userData.name,
        }
      );
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
    // Add a background color to the outermost div to prevent the flash.
    // This color should match the 'from' color of your gradient.
    <div className="min-h-screen flex bg-indigo-500">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <motion.main
        // The gradient and animation are now applied to the main content area,
        // which sits on top of the solid indigo-500 background of the parent div.
        className="flex-1 flex flex-col items-center justify-start pt-10 px-6 relative
                   bg-gradient-to-br from-indigo-500 to-pink-400 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          paddingLeft: isMobile ? "10px" : "64px",
          minHeight: "100vh",
        }}
      >
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Başlatılacak Quizi Seç
        </motion.h1>

        <motion.div
          className="border border-white/30 rounded-2xl p-2 w-full max-w-3xl flex flex-col gap-4 overflow-y-auto max-h-[70vh] px-1 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {quizzes.length === 0 ? (
            <motion.div
              className="text-center text-white/90 text-lg mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Henüz oluşturulmuş bir quiz yok.
            </motion.div>
          ) : (
            quizzes.map((quiz, index) => (
              <div
                key={quiz.quizId}
                className="relative bg-white/20 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 pl-8">
                  {quiz.title}
                </h3>
                <p className="text-sm text-white/80 mb-1">
                  Konu: <span className="font-medium">{quiz.subject}</span>
                </p>
                <p className="text-sm text-white/80 mb-4">
                  Quiz ID: {quiz.quizId}
                </p>

                <motion.button
                  onClick={() => handleSelectQuiz(quiz.quizId)}
                  className="mt-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Quizi Seç
                </motion.button>
              </div>
            ))
          )}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default QuizSelectionPage;
