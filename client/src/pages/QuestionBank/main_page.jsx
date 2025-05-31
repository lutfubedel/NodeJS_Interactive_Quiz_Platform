import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import QuestionBankForm from "../../Components/questionBankForm";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showFormPanel, setShowFormPanel] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const isMobile = windowWidth < 640;

  useEffect(() => {
    console.log("MongoDB'den gelen kullanıcı verisi:", userData);
    
    // Kullanıcı yoksa otomatik ana sayfaya sayfasına geçer.
    if (currentUser == null || userData == null) {
      console.log("User Bulunamadı");
      navigate("/home");
    }

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
    {
      id: 3,
      name: "Fizik Konuları",
      creator: "Zeynep Demir",
      lastUpdated: "29-05-2025",
      description: "Kapsamlı fizik soru arşivi",
    },
    {
      id: 4,
      name: "Fizik Konuları",
      creator: "Zeynep Demir",
      lastUpdated: "29-05-2025",
      description: "Kapsamlı fizik soru arşivi",
    },
    {
      id: 5,
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
        className={`flex-1 p-4 ${isMobile ? "pt-6" : ""}`}
        style={{
          paddingLeft: isMobile ? "15px" : "64px",
          minHeight: isMobile ? "auto" : "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems: "center",
          marginTop: isMobile ? "5vh" : "10vh",
          marginBottom: isMobile ? "5vh" : "10vh",
          gap: isMobile ? "1.5rem" : "0",
        }}
      >
        {/* Soru bankası ekle butonu */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-100 transition"
            onClick={() => setShowFormPanel(true)}
          >
            Soru Bankası Ekle
          </button>
        </div>

        {/* Soru bankaları listesi */}
        <div
          className="overflow-y-auto px-2 border border-white rounded-xl py-4"
          style={{
            maxHeight: isMobile ? "70vh" : "60vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {questionBanks.length === 0 ? (
            <div className="text-center text-white opacity-80 italic ">
              Henüz bir soru bankası oluşturulmamış.
            </div>
          ) : (
            questionBanks
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-md p-4 mb-4 w-full flex justify-between items-center"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-semibold">{bank.name}</span>
                    <span className="text-sm mt-1">
                      Oluşturan: {bank.creator}
                    </span>
                    <span className="text-sm">
                      Son Güncelleme: {bank.lastUpdated}
                    </span>
                    <span className="text-sm">
                      Açıklama: {bank.description}
                    </span>
                  </div>
                  <button className="border border-white/30 text-white/90 hover:bg-white/20 backdrop-blur-sm font-semibold py-2 px-5 rounded-xl transition duration-200">
                    Düzenle
                  </button>
                </div>
              ))
          )}
        </div>
        {showFormPanel && (
          <QuestionBankForm
            onSubmit={(newBank) => {
              setQuestionBanks((prev) => [
                {
                  id: Date.now(),
                  name: newBank.name,
                  creator: "Kullanıcı", // Gerçek kullanıcı adı burada olabilir
                  lastUpdated: new Date().toISOString().slice(0, 10),
                  description: newBank.description,
                },
                ...prev,
              ]);
              setShowFormPanel(false);
            }}
            onCancel={() => setShowFormPanel(false)}
          />
        )}
      </main>
    </div>
  );
};

export default QuestionBankPage;
