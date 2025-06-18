import { useState, useEffect } from "react";
import axios from "axios";

const QuestionSelectModal = ({ onClose, onSelectQuestions, userId }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5050/api/list-questionBanks",
          { uid: userId }
        );
        setBanks(response.data.questionBanks);
      } catch (error) {
        console.error("Bankalar alınırken hata:", error);
      }
    };
    fetchBanks();
  }, [userId]);

  const fetchQuestions = async (bankId) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/get-questions",
        { bankId }
      );
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Sorular alınırken hata:", error);
    }
  };

  const handleBankSelect = (bankId) => {
    setSelectedBankId(bankId);
    fetchQuestions(bankId);
  };

  const handleQuestionSelect = (question) => {
    if (!selectedQuestions.some((q) => q._id === question._id)) {
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const handleDone = () => {
    onSelectQuestions(selectedQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 rounded-xl bg-black/40 backdrop-blur-md z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-4xl text-black max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Soru Bankasından Soru Ekle</h2>

        {!selectedBankId ? (
          <>
            <p className="mb-2">Bir soru bankası seçin:</p>
            <ul className="space-y-2">
              {banks.map((bank) => (
                <li
                  key={bank._id}
                  className="p-3 border rounded cursor-pointer hover:bg-indigo-100 transition"
                  onClick={() => handleBankSelect(bank._id)}
                >
                  {bank.title}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mb-2 font-semibold">Sorular:</p>
            <div className="space-y-3 mb-4">
              {questions.map((q) => (
                <div
                  key={q._id}
                  className="border p-3 rounded-md flex justify-between items-center bg-gray-100"
                >
                  <span className="flex-1">{q.question}</span>
                  <button
                    className="ml-4 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
                    onClick={() => handleQuestionSelect(q)}
                  >
                    Seç
                  </button>
                </div>
              ))}
            </div>
            <button
              className="text-sm text-indigo-700 underline mb-3"
              onClick={() => setSelectedBankId(null)}
            >
              ← Geri dön
            </button>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                İptal
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleDone}
              >
                Seçilenleri Ekle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionSelectModal;
