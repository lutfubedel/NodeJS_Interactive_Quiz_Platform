import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import socket from "../socket";

function StartQuiz() {
  useEffect(() => {
    socket.on("connected", (data) => {
      console.log("Sunucudan mesaj geldi:", data.message);
    });

    return () => {
      socket.off("connected");
    };
  }, []); // sadece component en başında

  const handleStartQuiz = () => {
    console.log("Quiz başlatılıyor...");
    // socket.emit(...) gibi işlemler
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 className="text-4xl mb-6 text-black">Quiz Paneli</motion.h1>
        <StartButton handleStartQuiz={handleStartQuiz} />
      </motion.div>
    </div>
  );
}

function StartButton({ handleStartQuiz }) {
  return (
    <motion.button
      className="ring-2 ring-black text-black font-semibold py-3 px-10 rounded-xl shadow transition"
      onClick={handleStartQuiz}
      whileHover={{ scale: 1.1 }}
      whileTap={{
        scale: 0.9,
        rotate: 10,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.4 }}
    >
      Quizi Başlat
    </motion.button>
  );
}



export default StartQuiz;
