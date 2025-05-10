import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // useNavigate'yi ekliyoruz

function JoinQuiz() {
  const [roomCode, setRoomCode] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Uyarı mesajı göstermek için state
  const navigate = useNavigate(); // useNavigate hook'unu tanımlıyoruz

  const handleJoin = () => {
    if (roomCode.trim() !== "") {
      console.log("Odaya katılınıyor:", roomCode);
      navigate(`/QuizRoom/${roomCode}`); // Odaya katılma işlemi: yönlendirme
    } else {
      setShowAlert(true); // Oda kodu girilmediğinde uyarı mesajını göster
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Başlık */}
        <motion.h1 className="text-4xl mb-6 text-black">Odaya Katıl</motion.h1>

        {/* Input */}
        <InputElement roomCode={roomCode} setRoomCode={setRoomCode} />

        {/* Katıl Butonu */}
        <JoinButton handleJoin={handleJoin} />

        {/* Uyarı Mesajı */}
        {showAlert && (
          <motion.div
            className="mt-4 gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Lütfen bir oda kodu girin!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function JoinButton({ handleJoin }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(true); // Butona tıklandığında animasyonu başlat
    setTimeout(() => {
      handleJoin(); // Animasyon bitiminden sonra join işlemi başlasın
      setIsClicked(false); // Tıklama sonrasında animasyonu sıfırla
    }, 500); // Animasyonun süresi kadar bekle (örneğin: 500ms)
  };

  return (
    <motion.button
      className="ring-2 ring-black text-black font-semibold py-3 px-10 rounded-xl shadow  transition"
      onClick={handleButtonClick}
      whileHover={{ scale: 1.1 }} // Hover'da biraz büyür
      whileTap={{
        scale: 0.9, // Butona tıklanırken küçülür
        rotate: 10, // Hafif döner
        transition: { type: "spring", stiffness: 400, damping: 10 }, // Zıplama efekti gibi
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.4 }}
    >
      Katıl
    </motion.button>
  );
}

// Input öğesini ayrı bir fonksiyon olarak tanımlıyoruz ve props olarak roomCode, setRoomCode geçiriyoruz
function InputElement({ roomCode, setRoomCode }) {
  return (
    <motion.input
      type="text"
      placeholder="Oda Kodu Girin"
      value={roomCode}
      onChange={(e) => setRoomCode(e.target.value)} // Input değiştiğinde roomCode'u güncelliyoruz
      className="p-3 rounded-lg text-black placeholder-black mb-8 w-72 shadow-md ring-2 ring-black focus:outline-none"
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1 }}
      whileFocus={{ scale: 1.05 }} // Focus olduğunda büyüsün
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    />
  );
}

export default JoinQuiz;
