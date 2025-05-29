import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Components/Sidebar";

const QuestionBankPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");

  const isMobile = windowWidth < 640;

  const handleAddSection = () => {
    if (newSectionName.trim() === "") return;
    setSections([
      ...sections,
      { id: Date.now(), name: newSectionName, questions: [] },
    ]);
    setNewSectionName("");
  };

  const handleAddQuestion = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: Date.now(),
                  text: "",
                  options: ["", ""],
                  correctIndex: 0,
                },
              ],
            }
          : section
      )
    );
  };

  const updateQuestionField = (sectionId, questionId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : section
      )
    );
  };

  const updateOption = (sectionId, questionId, index, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt, i) =>
                        i === index ? value : opt
                      ),
                    }
                  : q
              ),
            }
          : section
      )
    );
  };

  const addOption = (sectionId, questionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId && q.options.length < 5
                  ? { ...q, options: [...q.options, ""] }
                  : q
              ),
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className="flex-1 p-6 sm:p-10 overflow-auto transition-all duration-300"
        style={{ marginLeft: !isMobile ? (isCollapsed ? 0 : 260) : 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Yeni Bölüm Oluştur</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Bölüm Adı"
                className="flex-1 p-2 rounded border border-white/40 bg-transparent focus:outline-none"
              />
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30"
              >
                Ekle
              </button>
            </div>

            {sections.map((section) => (
              <div key={section.id} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
                <button
                  onClick={() => handleAddQuestion(section.id)}
                  className="mb-4 text-sm text-white/80 hover:underline"
                >
                  + Soru Ekle
                </button>

                {section.questions.map((question) => (
                  <div
                    key={question.id}
                    className="mb-4 p-4 rounded-xl bg-white/10 border border-white/20"
                  >
                    <input
                      type="text"
                      placeholder="Soru metni"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestionField(
                          section.id,
                          question.id,
                          "text",
                          e.target.value
                        )
                      }
                      className="w-full p-2 mb-2 bg-transparent border border-white/30 rounded"
                    />
                    <div className="space-y-2">
                      {question.options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Şık ${i + 1}`}
                          value={opt}
                          onChange={(e) =>
                            updateOption(
                              section.id,
                              question.id,
                              i,
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-transparent border border-white/20 rounded"
                        />
                      ))}
                      {question.options.length < 5 && (
                        <button
                          onClick={() => addOption(section.id, question.id)}
                          className="text-xs text-white/70 mt-2 hover:underline"
                        >
                          + Şık Ekle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default QuestionBankPage;
