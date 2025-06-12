import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const QuestionBankSelectModal = ({ onClose, onSelect }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData?._id) return;

    const fetchBanks = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5050/api/list-questionBanks",
          {
            uid: userData._id,
          }
        );
        setBanks(res.data.questionBanks || []);
      } catch (err) {
        console.error("Soru bankaları alınamadı:", err);
      }
    };

    fetchBanks();
  }, [userData]);

  const fetchQuestions = async (bankId) => {
    try {
      const res = await axios.post("http://localhost:5050/api/get-questions", {
        bankId,
      });
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Sorular alınamadı:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-md border border-white/50 text-black rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Soru Bankasından Soru Seç
        </h2>

        {!selectedBankId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <button
                key={bank._id}
                className="w-full text-left px-5 py-4 bg-white/10 hover:bg-white/20 transition rounded-xl shadow-sm border border-white/60"
                onClick={() => {
                  setSelectedBankId(bank._id);
                  fetchQuestions(bank._id);
                }}
              >
                <span className="text-lg font-medium text-black">
                  {bank.title}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedBankId(null);
                setQuestions([]);
                setPreviewQuestion(null);
              }}
              className="text-sm text-black hover:underline mb-4 inline-block"
            >
              ← Farklı Banka Seç
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Soru Listesi */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-white/20 rounded-xl border border-white/40 shadow-sm hover:bg-white/30 transition cursor-pointer ${
                      previewQuestion?._id === q._id ? "ring-2 ring-white" : ""
                    }`}
                    onClick={() => setPreviewQuestion(q)}
                  >
                    <p className="text-black font-medium line-clamp-3">
                      {q.question}
                    </p>
                  </div>
                ))}
              </div>

              {/* Önizleme Paneli */}
              <div className="bg-white/20 border border-white/40 rounded-xl p-4 shadow-md h-fit text-black">
                {previewQuestion ? (
                  <>
                    <h3 className="font-semibold text-lg mb-2">
                      Soru Önizleme
                    </h3>
                    <p className="mb-3">{previewQuestion.question}</p>
                    <ul className="mb-4 space-y-1">
                      {previewQuestion.options?.map((opt, i) => {
                        const letter = String.fromCharCode(65 + i);
                        return (
                          <li key={i}>
                            <strong className="mr-2">{letter}.</strong> {opt}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow transition w-full"
                        onClick={() => onSelect(previewQuestion)}
                      >
                        ✅ Seç ve Onayla
                      </button>
                      <button
                        className="px-4 py-2 bg-white/60 hover:bg-white/80 text-black rounded-xl shadow transition w-full"
                        onClick={() => setPreviewQuestion(null)}
                      >
                        ❌ Vazgeç
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-black italic text-sm">Bir soru seçin...</p>
                )}
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-8 text-sm text-black hover:text-gray-700 hover:underline block mx-auto"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default QuestionBankSelectModal;
