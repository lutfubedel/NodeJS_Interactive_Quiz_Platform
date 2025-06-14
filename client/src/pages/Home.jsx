import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Framer Motion kullanıyoruz
import Buttons from "../Components/AnimatedButtons"; // Butonları component olarak import ettik
import { useAuth } from "../context/AuthContext";
import React, { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  // Anlık firebase ve mongodb verilerini tutar.
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    console.log("Firebase kullanıcısı:", currentUser);
    console.log("MongoDB'den gelen kullanıcı verisi:", userData);

    if(currentUser != null && userData != null){
      console.log("User Bulundu")
      navigate("/profile");
    }

  }, [currentUser, userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white animation-bg-gradient-move">
      {/* Sayfa içeriği ortalanmış */}
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -200 }} // Başlangıçta yukarıdan 200px dışarıda
        animate={{ opacity: 1, y: 0 }} // Animasyonla aşağı doğru kayar
        transition={{ duration: 1 }} // Animasyon süresi 1 saniye
      >
        Quiz Platforma Hoş Geldin!
      </motion.h1>

      <motion.p
        className="mb-8 text-lg"
        initial={{ opacity: 0, x: 200 }} // Başlangıçta sağdan 200px dışarıda
        animate={{ opacity: 1, x: 0 }} // Animasyonla sola doğru kayar
        transition={{ duration: 1 }} // Animasyon süresi 1 saniye
      >
        Giriş yapmak veya bir oyuna katılmak için seçeneklerden birini seç!
      </motion.p>

      {/* Butonlar Componenti */}
      <Buttons navigate={navigate} />
    </div>
  );
}

export default Home;
