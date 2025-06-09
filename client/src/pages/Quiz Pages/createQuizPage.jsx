import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CreateQuizForm from "../../Components/CreateQuizForm";
import { useAuth } from "../../context/AuthContext";

const CreateQuizPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [quizzes, setQuizzes] = useState([]);
  
  const { currentUser, userData } = useAuth();
  const isMobile = windowWidth < 640;

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

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main içerik blur oluyor modal açıkken */}
        <main
          className={`flex-1 flex flex-col items-center justify-start pt-10 px-6 relative transition-filter duration-300 ${
            isFormOpen ? "blur-sm" : ""
          }`}
          style={{
            paddingLeft: isMobile ? "10px" : "64px",
            minHeight: "100vh",
          }}
        >
          <div className="z-10 mb-6">
            <button
              className="flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-100 transition"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="w-5 h-6 mr-2" />
              Quiz Oluştur
            </button>
          </div>

          <div className="w-full max-w-3xl flex flex-col gap-4">
            {quizzes.length === 0 ? (
              <div className="text-center text-white/90 text-lg mt-8">
                Henüz aktif bir quiz yok.
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
                  <p className="text-sm text-white/80">
                    Quiz ID: {quiz.quizId}
                  </p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modal ve modal arka planı */}
      <AnimatePresence>
        {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center" // <-- sadeleştirildi
            >

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl rounded-xl "
            >
              <CreateQuizForm
                onClose={() => setIsFormOpen(false)}
                onQuizCreated={fetchQuizzes}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateQuizPage;
