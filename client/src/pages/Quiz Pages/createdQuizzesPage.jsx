import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {ChevronLeft,ChevronRight,ChevronUp,ChevronDown,} from "lucide-react";
import Sidebar from "../../Components/Sidebar";

const sampleCreatedQuizzes = [
  {
    id: 1,
    title: "Tarih Bilgisi Quiz",
    createdAt: "2025-04-15",
    startDate: "2025-04-16",
    endDate: "2025-04-17",
    participants: [
      { name: "Ali", score: 95 },
      { name: "Ayşe", score: 80 },
    ],
  },
  {
    id: 2,
    title: "Kimya Temel Kavramlar",
    createdAt: "2025-05-01",
    startDate: "2025-05-02",
    endDate: "2025-05-03",
    participants: [
      { name: "Mehmet", score: 85 },
      { name: "Fatma", score: 70 },
    ],
  },
  {
    id: 3,
    title: "Fizik Enerji Dönüşümleri",
    createdAt: "2025-05-05",
    startDate: "2025-05-06",
    endDate: "2025-05-07",
    participants: [
      { name: "Can", score: 90 },
      { name: "Elif", score: 88 },
    ],
  },
];

export default function CreatedQuizzesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < sampleCreatedQuizzes.length - 1;
  const currentQuiz = sampleCreatedQuizzes[currentIndex];

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
              {/* Quiz Index Gösterimi */}
              <div className="absolute top-2 left-2 bg-white/40 text-xs text-black px-2 py-1 rounded-md shadow">
                {currentIndex + 1} / {sampleCreatedQuizzes.length}
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">
                {currentQuiz.title}
              </h2>
              <p className="text-sm text-center mb-2">
                Oluşturulma: {currentQuiz.createdAt}
              </p>
              <div>
                <h3 className="font-semibold mb-2">Katılımcılar:</h3>
                <ul className="space-y-1 text-gray-800">
                  {currentQuiz.participants.map((p, idx) => (
                    <li
                      key={idx}
                      className="bg-white/50 rounded px-3 py-1 flex justify-between"
                    >
                      <span>{p.name}</span>
                      <span>{p.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
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
