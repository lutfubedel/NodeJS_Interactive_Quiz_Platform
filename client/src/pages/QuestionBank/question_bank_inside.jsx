import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Components/Sidebar";
import QuestionFormModal from "../../Components/QuestionFormModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditQuestionModal from "../../Components/EditQuestionModal";
import DeleteModal from "../../Components/DeleteModal"; // Yeni modal

const QuestionsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = windowWidth < 640;
  const { bankId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = async (newQuestion) => {
    console.log("Kaydedilen soru:", newQuestion);
    console.log("Bank ID:", bankId);
    try {
      await axios.post("http://localhost:5050/api/add-question", {
        bankId: bankId,
        question: newQuestion,
      });
      console.log("Soru başarıyla gönderildi");
    } catch (error) {
      console.error("Hata oluştu:", error.response?.data || error.message);
    }

    setIsModalOpen(false);
  };

  const questions = [
    {
      image: "https://via.placeholder.com/600x200.png?text=Soru+1",
      text: "Türkiye'nin başkenti neresidir?",
      options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    },
    {
      image: null,
      text: "React hangi programlama diliyle yazılmıştır?",
      options: ["Python", "JavaScript", "C#", "Ruby"],
    },
    {
      image: "https://via.placeholder.com/600x200.png?text=Soru+3",
      text: "5 + 7 işleminin sonucu nedir?",
      options: ["10", "11", "12", "13"],
    },
  ];

  const currentQuestion = questions[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < questions.length - 1;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{
          paddingLeft: isMobile ? "10px" : "64px",
          minHeight: "100vh",
        }}
      >
        {/* Soru Ekle Butonu */}
        <div className="absolute top-6 right-15 z-10">
          <button
            className="flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-100 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-6 mr-2" />
            Soru Ekle
          </button>
        </div>

        {/* Navigasyon ve Soru Paneli */}
        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } items-center justify-center w-full max-w-3xl px-4 gap-4 relative`}
        >
          {/* Geri Butonu */}
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={!canGoBack}
            className={`p-2 rounded-full bg-white/30 hover:bg-white/50 transition z-10 ${
              !canGoBack ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isMobile ? (
              <ChevronUp className="w-6 h-6 text-white" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Animasyonlu Soru Paneli */}
          <div className="relative flex-1 min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  x: isMobile ? 0 : 100,
                  y: isMobile ? 100 : 0,
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  x: isMobile ? 0 : -100,
                  y: isMobile ? -100 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-md p-3 text-white max-w-xl"
              >
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Soru görseli"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-lg font-semibold mb-4 text-center">
                  {currentQuestion.text}
                </p>
                <div className="space-y-2 mb-4">
                  {currentQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className="w-full bg-white/40 backdrop-blur-md text-gray-800 py-3 px-4 rounded-lg font-medium shadow flex items-center gap-2"
                    >
                      <span className="font-bold text-gray-700 w-5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    className="px-4 py-1 bg-indigo-500 rounded-lg text-sm text-white hover:scale-105 transition"
                    onClick={() => {
                      setSelectedQuestion(currentQuestion);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Düzenle
                  </button>
                  <button
                    className="px-4 py-1 bg-pink-400 text-white rounded-lg text-sm hover:scale-105 transition"
                    onClick={() => {
                      setSelectedQuestion(currentQuestion);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Sil
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* İleri Butonu */}
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={!canGoForward}
            className={`p-2 rounded-full bg-white/30 hover:bg-white/50 transition z-10 ${
              !canGoForward ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isMobile ? (
              <ChevronDown className="w-6 h-6 text-white" />
            ) : (
              <ChevronRight className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <QuestionFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}

        {isEditModalOpen && (
          <EditQuestionModal
            question={selectedQuestion}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updated) => {
              console.log("Düzenlenen soru:", updated);
              setIsEditModalOpen(false);
            }}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            message="Bu soruyu silmek istediğinize emin misiniz?"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              console.log("Soru silme onayı verildi:", selectedQuestion);
              setIsDeleteModalOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default QuestionsPage;
