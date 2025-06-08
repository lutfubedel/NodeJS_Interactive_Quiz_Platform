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
import DeleteModal from "../../Components/DeleteModal";

const QuestionsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const { bankId } = useParams();
  const isMobile = windowWidth < 640;

  const fetchQuestions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/get-questions",
        { bankId }
      );
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Sorular çekilirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    fetchQuestions();

    return () => window.removeEventListener("resize", handleResize);
  }, [bankId]);

  const handleSave = async (newQuestion) => {
    try {
      await axios.post("http://localhost:5050/api/add-question", {
        bankId,
        question: newQuestion,
      });
      await fetchQuestions();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Soru eklenirken hata oluştu:", error);
    }
  };

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
        style={{ paddingLeft: isMobile ? "10px" : "64px", minHeight: "100vh" }}
      >
        <div className="absolute top-6 right-5 z-10">
          <button
            className="flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-100 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-6 mr-2" />
            Soru Ekle
          </button>
        </div>

        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } items-center justify-center w-full max-w-3xl px-4 gap-4 relative`}
        >
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

          <div className="relative flex-1 min-h-[400px] flex items-center justify-center flex-col">
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
                className="w-full bg-white/20 backdrop-blur-md border mt-2 border-white/30 rounded-xl shadow-md p-3 text-white max-w-xl md:max-w-2/4"
              >
                {currentQuestion?.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Soru görseli"
                    className="w-full max-h-50 object-contain rounded-md mb-4"
                  />
                )}
                <p className="text-lg font-semibold mb-4 text-center">
                  {currentQuestion?.question || "Soru bulunamadı."}
                </p>

                <div className="space-y-2 mb-4">
                  {currentQuestion?.options?.map((opt, i) => {
                    const optionLetter = String.fromCharCode(65 + i);
                    const isCorrect =
                      currentQuestion?.correctAnswer === optionLetter;

                    return (
                      <div
                        key={i}
                        className={`w-full py-3 px-4 rounded-lg font-medium shadow flex items-center gap-2 ${
                          isCorrect
                            ? "bg-green-400 text-white"
                            : "bg-white/40 backdrop-blur-md text-gray-800"
                        }`}
                      >
                        <span
                          className={`font-bold w-5 ${
                            isCorrect ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {optionLetter}.
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    );
                  })}
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

            {questions.length > 0 && (
              <div className="flex flex-wrap justify-center mt-4 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-8 h-8 rounded-full font-semibold text-sm flex items-center justify-center transition ${
                      currentIndex === index
                        ? "bg-white text-indigo-600"
                        : "bg-white/30 text-white hover:bg-white/50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

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
              setIsEditModalOpen(false);
              fetchQuestions();
            }}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            message="Bu soruyu silmek istediğinize emin misiniz?"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={async () => {
              try {
                await axios.post("http://localhost:5050/api/delete-question", {
                  bankId,
                  questionText: selectedQuestion?.question,
                });
                await fetchQuestions();
              } catch (error) {
                console.error("Soru silinirken hata oluştu:", error);
              }
              setIsDeleteModalOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default QuestionsPage;
