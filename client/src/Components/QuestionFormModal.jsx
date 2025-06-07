import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modalBackdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const QuestionFormModal = ({ onClose, onSave }) => {
  const [question, setQuestion] = useState("");
  const [optionCount, setOptionCount] = useState(4);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionCountChange = (e) => {
    const count = parseInt(e.target.value);
    setOptionCount(count);
    const newOptions = Array(count).fill("");
    setOptions(newOptions);
    setCorrectAnswer("");
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
    alert("Lütfen soru metnini girin.");
    return;
    }

    if (options.some((opt) => !opt.trim())) {
      alert("Lütfen tüm şıkları doldurun.");
      return;
    }

    if (!correctAnswer) {
      alert("Lütfen doğru cevabı seçin.");
      return;
    }

    const newQuestion = { question, options, correctAnswer };
    onSave(newQuestion);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalBackdropVariants}
      >
        <motion.div
          className="bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-3xl shadow-lg p-6 w-full max-w-[600px] max-h-[80vh] overflow-y-auto relative"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalContentVariants}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-red-500"
            onClick={onClose}
          >
            <X />
          </button>

          <h2 className="text-xl font-bold mb-4">Yeni Soru Ekle</h2>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Soru Metni</label>
            <textarea
              className="w-full p-2 bg-white/10 text-white placeholder-white/70 border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-white transition"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Soru Görseli (PNG)
            </label>
            <div className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center text-gray-500 bg-white/10 backdrop-blur-md">
              PNG dosyası buraya yüklenecek (şimdilik pasif)
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Şık Sayısı</label>
            <select
              className="w-full p-2 border rounded focus:outline-none"
              value={optionCount}
              onChange={handleOptionCountChange}
            >
              <option value={2} className="text-black hover:bg-black">
                2
              </option>
              <option value={4} className="text-black">
                4
              </option>
            </select>
          </div>

          {options.map((opt, index) => (
            <div key={index} className="mb-3">
              <label className="block font-semibold mb-1">
                {String.fromCharCode(65 + index)} Şıkkı
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block font-semibold mb-1">Doğru Cevap</label>
            <select
              className="w-full p-2 border rounded focus:outline-none"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="" className="text-black">
                Seçiniz
              </option>
              {options.map((_, index) => (
                <option
                  key={index}
                  value={String.fromCharCode(65 + index)}
                  className="text-black"
                >
                  {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={handleSubmit}
            >
              Kaydet
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionFormModal;
