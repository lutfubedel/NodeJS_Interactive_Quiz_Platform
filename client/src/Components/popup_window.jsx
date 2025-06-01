import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const backdropVariant = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariant = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: "-50%",
    x: "-50%",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: "-50%",
    x: "-50%",
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const Popup = ({ show, message, bankId, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/delete-questionBank",
        {
          bankId: bankId,
        }
      );

      if (response.status === 200) {
        console.log("Silme başarılı.");
        onDeleteSuccess();
      } else {
        console.error("Sunucu hatası:", response.data);
      }
    } catch (error) {
      console.error("Silme isteği başarısız:", error.message);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center absolute top-1/2 left-1/2"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-semibold mb-4 text-red-600">Uyarı</h2>
            <p className="mb-6 text-gray-700">{message}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Evet
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
