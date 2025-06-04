import Sidebar from "../../Components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuizHistoryPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white relative">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

      {/* Mobile Overlay (Sidebar Açıkken arka planı kapatır) */}
      {isCollapsed && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 p-6 flex flex-col items-center justify-center z-0"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 drop-shadow-lg">
          Quiz Geçmişi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl cursor-pointer shadow-xl transition hover:shadow-2xl"
            onClick={() => navigate("/quiz-history/created-quizzes")}
          >
            <h2 className="text-2xl font-semibold mb-2">
              🧠 Oluşturduğum Quizler
            </h2>
            <p className="text-white/80 text-sm">
              Katılımcıları yönet, skorları gör, analizleri incele.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl cursor-pointer shadow-xl transition hover:shadow-2xl"
            onClick={() => navigate("/quiz-history/joined-quizzes")}
          >
            <h2 className="text-2xl font-semibold mb-2">
              📝 Katıldığım Quizler
            </h2>
            <p className="text-white/80 text-sm">
              Katıldığın quizlerin skorlarına ve detaylarına göz at.
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
