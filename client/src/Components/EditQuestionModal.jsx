import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";

const EditQuestionModal = ({ question, onClose, onSave }) => {
  const { bankId } = useParams();

  const [editedQuestion, setEditedQuestion] = useState({
    image: question.image,
    text: question.question,
    options: [...question.options],
    correctIndex:
      question.correctAnswer && typeof question.correctAnswer === "string"
        ? question.correctAnswer.charCodeAt(0) - 65
        : 0,
  });

  const [isClosing, setIsClosing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    // Eğer boş dosya seçildiyse (iptal edilirse) sadece görseli kaldır
    if (!file) {
      setEditedQuestion((prev) => ({ ...prev, image: "" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Lütfen yalnızca PNG veya JPG dosyası yükleyin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("http://localhost:5050/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setEditedQuestion((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (error) {
      console.error("Görsel yüklenemedi:", error);
      alert("Görsel yükleme hatası.");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsClosing(true);

    const payload = {
      bankId: bankId,
      originalText: question.question,
      updatedQuestion: {
        question: editedQuestion.text,
        options: editedQuestion.options,
        correctIndex: editedQuestion.correctIndex,
        image: editedQuestion.image,
      },
    };

    try {
      await axios.post("http://localhost:5050/api/update-question", payload);
    } catch (error) {
      console.error("Soru güncelleme hatası:", error);
    }

    setTimeout(() => {
      onSave(editedQuestion);
    }, 300);
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

            {/* Görsel alanı */}
            <div className="mb-2">
              <label className="block font-semibold text-white mb-1">
                Soru Görseli (.png, .jpg)
              </label>

              {!editedQuestion.image ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/40 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition text-white/70"
                >
                  {isUploading ? (
                    <span>Yükleniyor...</span>
                  ) : (
                    <>
                      <span>Görsel yüklemek için tıklayın</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={editedQuestion.image}
                    alt="Yüklenen görsel"
                    className="w-full max-h-48 object-contain rounded-md border border-white/30"
                  />

                  {/* Sağ alt: değiştir */}
                  <label
                    htmlFor="file-upload-replace"
                    className="absolute bottom-2 right-2 bg-white/80 text-indigo-600 hover:bg-indigo-600 hover:text-white transition p-2 rounded-full shadow cursor-pointer"
                    title="Görseli değiştir"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </label>

                  <input
                    id="file-upload-replace"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            {/* Soru metni */}
            <textarea
              placeholder="Soru metni"
              value={editedQuestion.text}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, text: e.target.value })
              }
              className="resize-none overflow-y-auto w-full p-2 rounded bg-white/40 text-gray-800 focus:outline-none focus:ring-1 focus:ring-white"
            />

            {/* Seçenekler */}
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

            {/* Doğru cevap seçimi */}
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

            {/* Butonlar */}
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
