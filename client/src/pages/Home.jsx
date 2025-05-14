import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Framer Motion kullanıyoruz
import Buttons from "../Components/AnimatedButtons"; // Butonları component olarak import ettik

function Home() {
  const navigate = useNavigate();

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
        Quiz başlatmak veya bir oyuna katılmak için seçeneklerden birini seç.
      </motion.p>

      {/* Butonlar Componenti */}
      <Buttons navigate={navigate} />

      {/* Alt kısmı ortalamak için flex ve padding kullanıyoruz */}
      <div className="flex justify-center w-full py-10">
        <motion.div
          className="text-sm text-gray-200"
          initial={{ opacity: 0, y: 200 }} // Başlangıçta aşağıdan 200px dışarıda
          animate={{ opacity: 1, y: 0 }} // Animasyonla yukarı doğru kayar
          transition={{ duration: 1 }} // Animasyon süresi 1 saniye
        >
          <span className="mx-2">Hesabın yok mu?</span>{" "}
          <motion.button
            className="underline cursor-pointer"
            whileHover={{ scale: 1.1 }} // Framer Motion ile hover'da büyüme animasyonu
            onClick={() => navigate("/signin")}
          >
            Kayıt Ol
          </motion.button>
          <span className="mx-2">veya</span>{" "}
          <motion.button
            className="underline cursor-pointer"
            whileHover={{ scale: 1.1 }} // Framer Motion ile hover'da büyüme animasyonu
            onClick={() => navigate("/login")}
          >
            Giriş Yap
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
