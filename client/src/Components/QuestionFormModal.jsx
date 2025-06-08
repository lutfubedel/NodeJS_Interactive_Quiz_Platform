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
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleOptionCountChange = (e) => {
    const count = parseInt(e.target.value);
    setOptionCount(count);
    setOptions(Array(count).fill(""));
    setCorrectAnswer("");
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/png")) {
      alert("Lütfen sadece PNG dosyası yükleyin.");
      return;
    }

    setImageFile(file);
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("http://localhost:5050/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Görsel yüklenemedi.");
    }
    setIsUploading(false);
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

    const newQuestion = {
      question,
      options,
      correctAnswer,
      image: imageUrl || null,
    };

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

          {/* Soru Metni */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Soru Metni</label>
            <textarea
              className="w-full p-2 bg-white/10 text-white placeholder-white/70 border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-white transition"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Soru Görseli */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Soru Görseli (PNG)</label>

            {!imageUrl && (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/40 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition text-white/70"
              >
                <svg
                  className="w-8 h-8 mb-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 16v4m0 0l-4-4m4 4l4-4M4 20h16"
                  />
                </svg>
                <span>
                  PNG dosyası yüklemek için tıklayın <br />
                  (Max 5MB)
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </label>
            )}

            {/* Yükleme sırasında spinner göster */}
            {isUploading && (
              <div className="mt-2 text-center text-white/80 animate-pulse">
                Yükleniyor...
              </div>
            )}

            {/* Yüklenmiş resmi göster */}
            {imageUrl && !isUploading && (
              <div className="mt-4 max-h-64 overflow-hidden rounded-lg border border-white/20 shadow">
                <img
                  src={imageUrl}
                  alt="Yüklenen Görsel"
                  className="w-full h-auto object-contain"
                />
                <button
                  className="mt-2 text-sm text-red-400 hover:text-red-600 underline"
                  onClick={() => {
                    setImageFile(null);
                    setImageUrl("");
                  }}
                >
                  Görseli Kaldır
                </button>
              </div>
            )}
          </div>


          {/* Şık Sayısı */}
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

          {/* Şıklar */}
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

          {/* Doğru Cevap */}
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

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={handleSubmit}
              disabled={isUploading}
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
