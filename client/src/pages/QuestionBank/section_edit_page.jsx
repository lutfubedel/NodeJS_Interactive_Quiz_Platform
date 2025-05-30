import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const mockSections = [
  { id: "1", name: "Matematik", updatedAt: "25-05-25", questions: [] },
  { id: "2", name: "Fizik", updatedAt: "26-05-25", questions: [] },
  // ...
];

const EditSectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    const foundSection = mockSections.find((sec) => sec.id.toString() === id);
    if (foundSection) {
      setSection(foundSection);
      setSectionName(foundSection.name);
    } else {
      navigate("/question-bank"); // Geçersiz id gelirse bölüm listesine dön
    }
  }, [id, navigate]);

  const handleSave = () => {
    alert(`Bölüm güncellendi: ${sectionName}`);
    navigate("/question-bank"); // Kaydettikten sonra bölüm listesine dön
  };

  if (!section) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 to-pink-400 text-white p-6">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl max-w-3xl w-full">
        <h2 className="text-3xl mb-6">Bölüm Düzenle</h2>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full p-3 rounded text-black mb-6"
        />
        <button
          onClick={handleSave}
          className="bg-indigo-600 px-6 py-3 rounded hover:bg-indigo-700 transition"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default EditSectionPage;
