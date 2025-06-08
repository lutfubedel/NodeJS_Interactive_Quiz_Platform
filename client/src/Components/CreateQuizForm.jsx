import { useState } from "react";
import QuestionSelectModal from "./QuestionSelectModal";

const CreateQuizForm = ({ onClose, onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Yeni state: QuestionSelectModal açma durumu ve seçilen sorular
  const [isQuestionSelectOpen, setIsQuestionSelectOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Burada title, subject, startDate, endDate ve seçilen soruları backend'e gönder
    console.log("Quiz Başlığı:", title);
    console.log("Konu:", subject);
    console.log("Başlangıç:", startDate);
    console.log("Bitiş:", endDate);
    console.log("Seçilen Sorular:", selectedQuestions);

    // Sonra
    onQuizCreated();
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col text-white text-sm font-medium ">
          Quiz Adı:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 rounded-md bg-white/80 text-black focus:outline-none focus:ring focus:ring-black"
            required
          />
        </label>

        <label className="flex flex-col text-white text-sm font-medium">
          Konu:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 p-2 rounded-md bg-white/80 text-black focus:outline-none focus:ring focus:ring-black"
            required
          />
        </label>

        <label className="flex flex-col text-white text-sm font-medium ">
          Başlangıç Tarihi ve Saati:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 rounded-md bg-white/80 text-black focus:outline-none focus:ring focus:ring-black"
            required
          />
        </label>

        <label className="flex flex-col text-white text-sm font-medium">
          Bitiş Tarihi ve Saati:
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-2 rounded-md bg-white/80 text-black focus:outline-none focus:ring focus:ring-black"
            required
          />
        </label>

        <div className="flex justify-center">
          <button
            type="button"
            className="text-sm text-white underline mr-4"
            onClick={() => setIsQuestionSelectOpen(true)}
          >
            + Soru Ekle
          </button>
        </div>
        {/* Seçilen soruları listele */}
        {selectedQuestions.length > 0 && (
          <div className="bg-white/20 rounded p-3 mb-4 text-black max-h-40 overflow-auto">
            <h4 className="font-semibold mb-2">Seçilen Sorular:</h4>
            <ul className="list-disc list-inside text-sm">
              {selectedQuestions.map((q, i) => (
                <li key={i}>{q.questionText || q.text || "Soru metni yok"}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-transform duration-500 ease-out hover:scale-115"
          >
            Kaydet
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-transform duration-500 ease-out hover:scale-115"
            onClick={onClose}
          >
            İptal
          </button>
        </div>
      </form>
      {/* QuestionSelectModal burada */}
      {isQuestionSelectOpen && (
        <QuestionSelectModal
          onClose={() => setIsQuestionSelectOpen(false)}
          onSelectQuestions={(questions) => {
            setSelectedQuestions(questions);
            setIsQuestionSelectOpen(false);
          }}
          // userId veya başka prop varsa ekle
        />
      )}
    </>
  );
};

export default CreateQuizForm;
