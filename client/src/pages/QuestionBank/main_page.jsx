import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Components/Sidebar";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isMobile = windowWidth < 640;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddSection = () => {
    if (newSectionName.trim() === "") return;
    setSections((prev) => [
      {
        id: Date.now(),
        name: newSectionName,
        updatedAt: new Date().toLocaleDateString("tr-TR"),
        questions: [],
      },
      ...prev,
    ]);
    setNewSectionName("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <main
        className="flex-1 p-6 overflow-hidden"
        style={
          isMobile
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }
        }
      >
        {/* Bölüm Ekle Butonu */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 px-6 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Bölüm Ekle
        </button>

        {/* Liste */}
        <div className="w-full max-w-5xl overflow-x-auto scrollbar-hide">
          {sections.length === 0 ? (
            <p className="text-center text-white/80 text-lg">
              Şu an hiç bölümün yok!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{section.name}</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Son güncelleme: {section.updatedAt}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-500 rounded-md hover:bg-indigo-600 transition">
                    Bölümü Düzenle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="max-w-3xl w-[90%] bg-white/40 backdrop-blur-md border border-white/30 text-white p-8 rounded-2xl shadow-xl"
              >
                <h2 className="text-2xl font-semibold mb-4">Yeni Bölüm Ekle</h2>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Bölüm adı"
                  className="w-full px-4 py-2 rounded-md text-black mb-6"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddSection}
                    className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                  >
                    Onayla
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default QuestionBankPage;
