import Sidebar from "../Components/Sidebar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sidebarExpandedWidth = 260;

const avatarOptions = [
  "/avatars/avatar_1.jpg",
  "/avatars/avatar_2.jpg",
  "/avatars/avatar_3.jpg",
  "/avatars/avatar_4.jpg",
  "/avatars/avatar_5.jpg",
  "/avatars/avatar_6.jpg",
];

export default function ProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthdate: "",
    avatar_url: "",
  });

  const handleToggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (!currentUser || !userData) {
      navigate("/home");
    } else {
      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        birthdate: userData.birthdate || "",
        avatar_url: userData.avatar_url || "/avatars/avatar_1.jpg",
      });
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentUser, userData, navigate]);

const handleSave = async () => {
  if (
    formData.name === userData.name &&
    formData.surname === userData.surname &&
    formData.birthdate === userData.birthdate &&
    formData.avatar_url === userData.avatar_url
  ) {
    setIsEditing(false);
    return; 
  }

  try {
    const response = await axios.post("https://nodejsinteractivequizplatform-production.up.railway.app:5050/api/update-user", {
      userId: userData._id,
      name: formData.name,
      surname: formData.surname,
      birthdate: formData.birthdate,
      avatar_url: formData.avatar_url,
    });

    if (response.status === 200) {
      window.location.reload();
    } else {
      alert(response.data.message || "Güncelleme başarısız.");
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    alert("Sunucu hatası oluştu.");
  }
};


  const isMobile = windowWidth < 640;
  const mainMarginLeft = !isMobile ? 0 : isCollapsed ? sidebarExpandedWidth : 0;

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

      <main
        className="flex-1 p-10 overflow-auto transition-all duration-300"
        style={{ marginLeft: mainMarginLeft }}
      >
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view-mode"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 text-white p-8 rounded-2xl shadow-xl"
              style={{
                minHeight: "auto",
                marginTop: "10vh",
                marginBottom: "10vh",
              }}
            >
              <div
                className={`flex gap-6 ${isMobile ? "flex-col items-center" : "flex-row items-center"}`}
              >
                <div className="w-24 h-24 rounded-2xl flex-shrink-0 shadow-lg overflow-hidden">
                  <img
                    src={userData.avatar_url}
                    alt="Profil Fotoğrafı"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className={`text-left ${isMobile ? "mt-4 text-center" : ""}`}>
                  <p className="text-2xl font-bold mb-1 tracking-wide">
                    {userData.name} {userData.surname}
                  </p>
                  <p className="text-sm text-white/90 mb-1">{userData.email}</p>
                  <p className="text-sm text-white/90">{userData.birthdate}</p>
                </div>
              </div>

              <div className={`mt-8 ${isMobile ? "text-center" : "text-right"}`}>
                <button
                  onClick={() => setIsEditing(true)}
                  className="border border-white/30 text-white/90 hover:bg-white/20 backdrop-blur-sm font-semibold py-2 px-5 rounded-xl transition duration-200"
                >
                  <span className="bg-gradient-to-br from-indigo-500 to-pink-400 bg-clip-text text-transparent">
                    Bilgileri Güncelle
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit-mode"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md text-white p-8 rounded-xl shadow-lg border border-white/30"
              style={{
                marginTop: "10vh",
                marginBottom: "10vh",
              }}
            >
              <h2 className="text-2xl font-bold mb-6 text-left">Bilgileri Güncelle</h2>

<div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg group cursor-pointer mx-auto">
  <img
    src={formData.avatar_url}
    alt="Avatar"
    className="w-full h-full object-cover rounded-2xl"
  />
  <button
    onClick={() => setShowAvatarPopup(true)}
    className="absolute inset-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-2xl"
    title="Avatarı değiştir"
    type="button"
  >
    🖊️
  </button>
</div>





              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white w-full">
                <div>
                  <label className="block text-sm font-semibold mb-1">Ad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Soyad</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Doğum Tarihi</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="mt-8 text-right w-full">
                <button
                  onClick={handleSave}
                  className="bg-transparent border border-white/70 hover:bg-white/20 text-white font-bold py-2 px-4 rounded transition"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Avatar seçim popup */}
      {showAvatarPopup && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/20 border border-white/30 p-6 rounded-xl shadow-xl text-white max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Avatar Seç</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {avatarOptions.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => {
                    setFormData({ ...formData, avatar_url: avatar });
                    setShowAvatarPopup(false);
                  }}
                  className={`w-16 h-16 object-cover rounded-xl cursor-pointer hover:ring-4 ${
                    formData.avatar_url === avatar ? "ring-white" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAvatarPopup(false)}
                className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-xl transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
