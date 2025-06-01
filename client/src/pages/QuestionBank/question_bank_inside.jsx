import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import QuestionFormModal from "../../Components/QuestionFormModal";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newQuestion) => {
    console.log("Kaydedilen soru:", newQuestion);
    setIsModalOpen(false);
    // TODO: API ile backend'e gönder
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main className="flex-1 p-6 relative">
        <div className="flex justify-end">
          <button
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold py-2 px-4 rounded-xl shadow hover:bg-indigo-100 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Soru Ekle
          </button>
        </div>

        {isModalOpen && (
          <QuestionFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
};

export default QuestionBankPage;
