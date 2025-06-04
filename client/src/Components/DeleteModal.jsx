import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteModal = ({ message, onClose, onConfirm }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <AnimatePresence>
        {!isClosing && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-xl shadow-xl max-w-sm w-full text-white text-center space-y-4"
          >
            <h2 className="text-xl font-bold">{message}</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                Hayır
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg"
              >
                Evet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteModal;
