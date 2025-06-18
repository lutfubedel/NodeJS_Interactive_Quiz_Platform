import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { FileQuestion, Trash2 } from "lucide-react";
import QuestionFormModal from "../../Components/QuestionFormModal";
import QuestionBankSelectModal from "../../Components/QuestionBankSelectModal";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const AddQuestionsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const { currentUser, userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalQuestionIndex, setModalQuestionIndex] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      const count = location.state.questionCount || 0;
      setQuestionCount(count);
      setQuestions(Array(count).fill(null));
    }
  }, [location.state]);

  const handleQuestionClick = (index) => {
    if (questions[index]) return; // Eğer soru varsa, tıklamayı engelle
    setModalQuestionIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalQuestionIndex(null);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated[index] = null;
    setQuestions(updated);
  };

  const renderQuestionList = () => (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {Array.from({ length: questionCount }).map((_, i) => {
        const question = questions[i];
        return (
          <motion.div
            key={i}
            onClick={() => handleQuestionClick(i)}
            className={`relative rounded-xl p-4 pr-20 transition shadow-md group cursor-pointer
              ${
                question
                  ? "bg-green-500/30 ring-2 ring-green-400 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white ring-1 ring-white/10"
              }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            {question && (
              <div
                className="absolute right-3 flex gap-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleRemoveQuestion(i)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                  Sil
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <FileQuestion className="w-6 h-6 text-white/80" />
                <span className="font-medium text-lg">Soru {i + 1}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  const handleQuizCreate = async () => {
    const payload = {
      title: location.state?.title || "Yeni Quiz",
      description: location.state?.description || "",
      createdBy: userData.name || "unknown",
      questions: questions,
      questionCount: questions.length,
      startDate: location.state?.startDate || new Date().toISOString(),
      endDate:
        location.state?.endDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    };

    try {
      const response = await fetch("https://nodejsinteractivequizplatform-production.up.railway.app:5050/api/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/create-quiz");
      } else {
        alert("Quiz oluşturulamadı: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası.");
    }
  };

  return (
    <motion.div
      className="min-h-screen relative flex bg-gradient-to-br from-indigo-600 to-pink-500 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="md:ml-5 flex-1 p-8 overflow-y-auto pb-32">
        <motion.h1
          className="text-3xl font-bold mb-8 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Soru Listesi
        </motion.h1>
        <div className="w-full max-w-6xl mx-auto">{renderQuestionList()}</div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white/40 backdrop-blur-md border border-white/30 text-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Soru {modalQuestionIndex + 1}
              </h2>
              <div className="flex flex-col gap-4">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => {
                    setShowQuestionForm(true);
                    setShowModal(false);
                  }}
                >
                  Yeni Soru Oluştur
                </button>
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => {
                    setShowBankModal(true);
                    setShowModal(false);
                  }}
                >
                  Soru Bankasından Soru Seç
                </button>
                <button
                  className="mt-2 text-sm text-white hover:underline self-center"
                  onClick={handleCloseModal}
                >
                  Vazgeç
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showQuestionForm && (
        <QuestionFormModal
          onClose={() => setShowQuestionForm(false)}
          onSave={(newQuestion) => {
            setQuestions((prev) => {
              const updated = [...prev];
              updated[modalQuestionIndex] = newQuestion;
              return updated;
            });
            setShowQuestionForm(false);
            setModalQuestionIndex(null);
          }}
        />
      )}

      {showBankModal && (
        <QuestionBankSelectModal
          onClose={() => setShowBankModal(false)}
          onSelect={(questionFromBank) => {
            setQuestions((prev) => {
              const updated = [...prev];
              const indexToSet =
                modalQuestionIndex !== null
                  ? modalQuestionIndex
                  : updated.findIndex((q) => q === null);
              if (indexToSet !== -1) updated[indexToSet] = questionFromBank;
              return updated;
            });
            setShowBankModal(false);
            setModalQuestionIndex(null);
          }}
        />
      )}

      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleQuizCreate}
          disabled={questions.filter((q) => q).length !== questionCount}
          className={`px-8 py-3 rounded-full font-semibold text-lg transition shadow-xl
            ${
              questions.filter((q) => q).length !== questionCount
                ? "bg-gray-400 cursor-not-allowed text-white/70"
                : "bg-gradient-to-r from-indigo-500 to-pink-400 hover:from-indigo-600 hover:to-pink-500 text-white"
            }`}
        >
          Quiz Oluştur
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AddQuestionsPage;
