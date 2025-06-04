import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import QuestionBankForm from "../../Components/questionBankForm";
import DeleteModal from "../../Components/DeleteModal";
import axios from "axios";
import { motion } from "framer-motion";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(null);

  // Sil butonuna tıklanınca
  const handleDeleteClick = (bank) => {
    setPopupMessage(
      `"${bank.name}" adlı soru bankasını silmek istediğinize emin misiniz?`
    );
    setSelectedBankId(bank.id);
    setShowPopup(true);
  };

  // onConfirm içinde şimdilik sadece modal kapansın
  const handleConfirmDelete = () => {
    console.log("Silinecek ID:", selectedBankId);
    setShowPopup(false);
  };

  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const isMobile = windowWidth < 640;

  const fetchQuestionBanks = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/list-questionBanks",
        { uid: userData._id }
      );

      const formattedBanks = response.data.questionBanks.map((bank) => ({
        id: bank._id,
        name: bank.title,
        creator: bank.creator,
        lastUpdated: bank.createdDate || "Tarih Yok",
        description: bank.subtitle || "Açıklama Yok",
      }));

      setQuestionBanks(formattedBanks);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (currentUser == null || userData == null) {
      navigate("/home");
      return;
    }

    fetchQuestionBanks();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentUser, userData]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        className={`flex-1 p-4 ${isMobile ? "pt-6" : ""}`}
        style={{
          paddingLeft: isMobile ? "15px" : "64px",
          minHeight: isMobile ? "auto" : "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: isMobile ? "5vh" : "10vh",
          marginBottom: isMobile ? "5vh" : "10vh",
          gap: isMobile ? "1.5rem" : "0",
        }}
      >
        <div className="flex justify-center mb-6">
          <button
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-100 transition"
            onClick={() => setShowFormPanel(true)}
          >
            Soru Bankası Ekle
          </button>
        </div>

        <div
          className="overflow-y-auto px-2 border border-white rounded-xl py-4 w-full"
          style={{
            maxWidth: isMobile ? "50vh" : "180vh",
            maxHeight: isMobile ? "70vh" : "60vh",
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
                  <div
                    className={`flex justify-end ${
                      isMobile
                        ? "flex-col gap-y-3 items-end"
                        : "flex-row gap-x-3"
                    }`}
                  >
                    <button
                      className="w-32 border border-white/30 text-white/90 hover:bg-white/20 backdrop-blur-sm font-semibold py-2 px-5 rounded-xl transition duration-200"
                      onClick={() => navigate(`/question-bank/${bank.id}`)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="w-32 border border-white/30 text-white/90 hover:bg-white/20 backdrop-blur-sm font-semibold py-2 px-5 rounded-xl transition duration-200"
                      onClick={() => handleDeleteClick(bank)}
                    >
                      Sil
                    </button>
                  </div>
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
                  creator: "Kullanıcı",
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

        {showPopup && (
          <DeleteModal
            message={popupMessage}
            onClose={() => setShowPopup(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </motion.main>
    </div>
  );
};

export default QuestionBankPage;
