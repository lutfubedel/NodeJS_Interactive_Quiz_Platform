import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Components/Sidebar";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isMobile = windowWidth < 640;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Örnek soru bankaları
  const [questionBanks, setQuestionBanks] = useState([
    {
      id: 1,
      name: "Matematik Bankası",
      creator: "Ahmet Yılmaz",
      lastUpdated: "30-05-2025",
      description: "Lise düzeyi matematik soruları",
    },
    {
      id: 2,
      name: "Fizik Konuları",
      creator: "Zeynep Demir",
      lastUpdated: "29-05-2025",
      description: "Kapsamlı fizik soru arşivi",
    },
  ]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <main
        className="flex-1 p-4"
        style={{
          paddingLeft: "64px",
          ...(isMobile
            ? {
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10vh",
                marginBottom: "10vh",
              }
            : {
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10vh",
                marginBottom: "10vh",
              }),
        }}
      >
        {/* Soru bankası ekle butonu */}
        <div className="flex justify-center mb-6">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-100 transition">
            Soru Bankası Ekle
          </button>
        </div>

        {/* Soru bankaları listesi */}
        <div
          className="overflow-y-auto px-2"
          style={{
            maxHeight: isMobile ? "60vh" : "50vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {questionBanks.length === 0 ? (
            <div className="text-center text-white opacity-80 italic">
              Henüz bir soru bankası oluşturulmamış.
            </div>
          ) : (
            questionBanks
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white text-indigo-800 rounded-xl shadow-md p-4 mb-4 w-full flex justify-between items-center"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-semibold">{bank.name}</span>
                    <span className="text-sm text-gray-600 mt-1">
                      Oluşturan: {bank.creator}
                    </span>
                    <span className="text-sm text-gray-600">
                      Son Güncelleme: {bank.lastUpdated}
                    </span>
                    <span className="text-sm text-gray-600">
                      Açıklama: {bank.description}
                    </span>
                  </div>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition">
                    Düzenle
                  </button>
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionBankPage;
