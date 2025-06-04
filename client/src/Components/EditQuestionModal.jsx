import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EditQuestionModal = ({ question, onClose, onSave }) => {
  const [editedQuestion, setEditedQuestion] = useState({
    image: question.image,
    text: question.text,
    options: [...question.options],
    correctIndex: 0,
  });

  const [isClosing, setIsClosing] = useState(false);

  const handleChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // animasyon süresi kadar
  };

  const handleSave = () => {
    setIsClosing(true);
    setTimeout(() => {
      onSave(editedQuestion);
    }, 300); // animasyon süresi kadar
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <AnimatePresence>
        {!isClosing && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-xl shadow-xl max-w-md w-full text-white space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-center">Soru Düzenle</h2>

            <div className="w-full bg-white/40 text-gray-800 p-3 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-white/60 h-20 cursor-not-allowed">
              <p className="text-sm text-gray-700 font-medium">
                Görsel buraya yüklenecek
              </p>
              <p className="text-xs text-gray-600">
                (.png, .jpg desteklenecek)
              </p>
            </div>

            <textarea
              placeholder="Soru metni"
              value={editedQuestion.text}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, text: e.target.value })
              }
              className="resize-none overflow-y-auto w-full p-2 rounded bg-white/40 text-gray-800 focus:outline-none focus:ring-1 focus:ring-white"
            />

            {editedQuestion.options.map((opt, i) => (
              <div key={i} className="w-full flex items-center mb-1">
                <div className="w-6 text-gray-800 font-bold">
                  {String.fromCharCode(65 + i)}.
                </div>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Seçenek ${String.fromCharCode(65 + i)}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="flex-1 p-2 rounded bg-white/40 text-gray-800 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            ))}

            <select
              className="w-full p-2 bg-white/40 text-gray-800 rounded"
              value={editedQuestion.correctIndex}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  correctIndex: parseInt(e.target.value),
                })
              }
            >
              {editedQuestion.options.map((_, i) => (
                <option key={i} value={i}>
                  Doğru Cevap: {String.fromCharCode(65 + i)}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditQuestionModal;
