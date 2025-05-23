import { motion } from "framer-motion"; // Framer Motion ile animasyon

function Buttons({ navigate }) {
  return (
    <div className="flex gap-6">
      <motion.button
        className="quiz-choose-button"
        onClick={() => navigate("/startquiz")}
        initial={{ opacity: 0, x: -200 }} // Başlangıçta sağdan 200px dışarıda
        animate={{ opacity: 1, x: 0 }} // Animasyonla sola doğru kayar
        transition={{ duration: 1 }} // Animasyon süresi 1 saniye
        whileHover={{ scale: 1.05 }} // Hoverda buton büyür
      >
        Yeni Quiz Başlat
      </motion.button>

      <motion.button
        className="quiz-choose-button"
        onClick={() => navigate("/createquiz")}
        initial={{ opacity: 0, x: -200 }} // Başlangıçta sağdan 200px dışarıda
        animate={{ opacity: 1, x: 0 }} // Animasyonla sola doğru kayar
        transition={{ duration: 1 }} // Animasyon süresi 1 saniye
        whileHover={{ scale: 1.05 }} // Hoverda buton büyür
      >
        Yeni Quiz Oluştur
      </motion.button>

      <motion.button
        className="quiz-choose-button"
        onClick={() => navigate("/joinquiz")}
        initial={{ opacity: 0, x: -200 }} // Başlangıçta sağdan 200px dışarıda
        animate={{ opacity: 1, x: 0 }} // Animasyonla sola doğru kayar
        transition={{ duration: 1 }} // Animasyon süresi 1 saniye
        whileHover={{ scale: 1.05 }} // Hoverda buton büyür
      >
        Odaya Katıl
      </motion.button>
    </div>
  );
}

export default Buttons;
