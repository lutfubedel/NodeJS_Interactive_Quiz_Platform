import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function CreatedQuizzesPage() {
  const { userData } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [participantCount, setParticipantCount] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userData?.name) return;

    const fetchQuizzes = async () => {
      try {
        const response = await axios.post("https://nodejsinteractivequizplatform-production.up.railway.app:5050/api/list-myQuizzes", {
          name: userData.name,
        });
        setQuizzes(response.data.questionBanks);
      } catch (error) {
        console.error("Quiz verileri alınamadı:", error);
      }
    };

    fetchQuizzes();
  }, [userData]);

  // Katılımcı sayısını getir
  useEffect(() => {
    const fetchParticipantCount = async () => {
      const currentQuiz = quizzes[currentIndex];
      if (!currentQuiz?._id) return;

      try {
        const response = await axios.post("https://nodejsinteractivequizplatform-production.up.railway.app:5050/api/count-participants", {
          quizId: currentQuiz.quizId,
        });
        setParticipantCount(response.data.count);
      } catch (error) {
        console.error("Katılımcı sayısı alınamadı:", error);
        setParticipantCount(null);
      }
    };

    if (quizzes.length > 0) {
      fetchParticipantCount();
    }
  }, [currentIndex, quizzes]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < quizzes.length - 1;
  const currentQuiz = quizzes[currentIndex];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center relative px-6 py-10">
        <div className="relative w-full max-w-xl flex items-center justify-center">
          {/* Mobil Yukarı Ok */}
          {isMobile && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              disabled={!canGoBack}
              className={`absolute -top-15 p-2 rounded-full bg-white/30 hover:bg-white/50 transition ${
                !canGoBack ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Sol Ok */}
          {!isMobile && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              disabled={!canGoBack}
              className={`absolute left-[-60px] p-2 rounded-full bg-white/30 hover:bg-white/50 transition ${
                !canGoBack ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Quiz Paneli */}
          <AnimatePresence mode="wait">
            {currentQuiz && (
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
                className="relative bg-white/30 border border-white rounded-xl p-6 text-black backdrop-blur-md shadow-md w-full"
              >
                <div className="absolute top-2 left-2 bg-white/40 text-xs text-black px-2 py-1 rounded-md shadow">
                  {currentIndex + 1} / {quizzes.length}
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">
                  {currentQuiz.title}
                </h2>

                <div className="mb-3 text-center text-sm text-black font-medium">
                  Katılımcı Sayısı:{" "}
                  {participantCount !== null ? `${participantCount} kişi` : "Yükleniyor..."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sağ Ok */}
          {!isMobile && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!canGoForward}
              className={`absolute right-[-60px] p-2 rounded-full bg-white/30 hover:bg-white/50 transition ${
                !canGoForward ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Mobil Aşağı Ok */}
          {isMobile && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!canGoForward}
              className={`absolute -bottom-15 p-2 rounded-full bg-white/30 hover:bg-white/50 transition ${
                !canGoForward ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
