// Components/QuestionBankForm.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const QuestionBankForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Arka plan scroll'u kapat
  useEffect(() => {
    console.log("MongoDB'den gelen kullanıcı verisi:", userData);
    // Kullanıcı yoksa otomatik ana sayfaya sayfasına geçer.
    if (currentUser == null || userData == null) {
      console.log("User Bulunamadı");
      navigate("/home");
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Yeni Soru Bankası Oluşturma ve kaydetme
  const handleConfirm = async () => {
    if (name.trim() && description.trim()) {
      onSubmit({ name, description });
    }

    const newQBank = {
      uid: userData._id,
      title: name,
      subtitle: description,
      creator: userData.name,
    };
    await axios.post("http://localhost:5050/api/create-questionBank", newQBank);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel} // Arka plana tıklayınca kapat
      >
        <motion.div
          onClick={(e) => e.stopPropagation()} // Panel içinde tıklamayı engelle
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="bg-white text-indigo-800 p-6 rounded-xl shadow-2xl w-11/12 max-w-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <h2 className="text-xl font-bold mb-4">Yeni Soru Bankası</h2>
          <input
            type="text"
            placeholder="İsim"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
          <textarea
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Onayla
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionBankForm;
