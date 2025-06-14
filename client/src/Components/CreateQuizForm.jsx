import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuizForm = ({ onClose, onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const navigate = useNavigate();

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/add-questions", {
      state: { title, subject, questionCount },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-xl shadow-xl max-w-md w-full text-white space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-white">
          Quiz Oluştur
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Quiz Adı</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded bg-white/40 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Konu</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-2 rounded bg-white/40 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">
              Soru Sayısı (5-20)
            </label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              min={5}
              max={20}
              className="p-2 rounded bg-white/40 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizForm;
