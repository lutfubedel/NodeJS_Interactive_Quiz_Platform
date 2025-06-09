import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuizForm = ({ onClose, onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const navigate = useNavigate();

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    //if (start < now) return alert("Başlangıç tarihi şu andan önce olamaz.");
    //if (end <= start) return alert("Bitiş tarihi, başlangıçtan sonra olmalı.");
    //if (questionCount < 5 || questionCount > 20)
      //return alert("Soru sayısı 5 ile 20 arasında olmalı.");

    console.log({ title, subject, startDate, endDate, questionCount });
    //onQuizCreated();
    onClose();
    navigate("/add-questions" ,{
      state: { title, subject, startDate, endDate, questionCount },
    })
        
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg flex flex-col gap-4 max-w-md mx-auto"
    >
      <h2 className="text-gray-800 text-lg font-semibold text-center">Quiz Oluştur</h2>

      <div className="flex flex-col">
        <label className="text-gray-700 text-sm mb-1">Quiz Adı</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-white text-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 text-sm mb-1">Konu</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 rounded bg-white text-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm mb-1">Başlangıç Tarihi</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded bg-white text-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            min={getMinDateTime()}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm mb-1">Bitiş Tarihi</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded bg-white text-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            min={startDate || getMinDateTime()}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 text-sm mb-1">Soru Sayısı (5-20)</label>
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          min={5}
          max={20}
          className="p-2 rounded bg-white text-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium"
        >
          Kaydet
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium"
        >
          İptal
        </button>
      </div>
    </form>
  );
};

export default CreateQuizForm;
