import Sidebar from "../Components/Sidebar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const sidebarExpandedWidth = 260;

export default function ProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleToggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    console.log("MongoDB'den gelen kullanıcı verisi:", userData);
    // Kullanıcı yoksa otomatik ana sayfaya sayfasına geçer.
    if(currentUser == null || userData == null){
      console.log("User Bulunamadı")
      navigate("/home");
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const user = {
    name: userData.name,
    surname: userData.surname,
    email: userData.email,
    birthdate: userData.birthdate,
    avatarUrl: userData.avatar_url
  };

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };
  const isMobile = windowWidth < 640;

  const mainMarginLeft = !isMobile ? 0 : isCollapsed ? sidebarExpandedWidth : 0;
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 to-pink-400 text-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

      {/* Main */}
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
              style={
                windowWidth < 640
                  ? {
                      minHeight: "auto", // İçeriğe göre yükseklik
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10vh",
                      marginBottom: "10vh",
                    }
                  : {}
              }
            >
              <div
                className={`flex gap-6 ${
                  windowWidth < 640
                    ? "flex-col items-center"
                    : "flex-row items-center"
                }`}
              >
                <div className="w-24 h-24 rounded-2xl flex-shrink-0 shadow-lg overflow-hidden">
                  <img
                    src={user.avatarUrl}
                    alt="Profil Fotoğrafı"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Kullanıcı bilgileri */}
                <div
                  className={`text-left ${
                    windowWidth < 640 ? "mt-4 text-center" : ""
                  }`}
                >
                  <p className="text-2xl font-bold mb-1 tracking-wide">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-sm text-white/90 mb-1">{user.email}</p>
                  <p className="text-sm text-white/90">{user.birthdate}</p>
                </div>
              </div>

              {/* Buton kısmı */}
              <div
                className={`mt-8 ${
                  windowWidth < 640 ? "text-center" : "text-right"
                }`}
              >
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
              style={
                windowWidth < 640
                  ? {
                      minHeight: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10vh",
                      marginBottom: "10vh",
                    }
                  : {}
              }
            >
              <h2 className="text-2xl font-bold mb-6 text-left">
                Bilgileri Güncelle
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white w-full">
                <div>
                  <label className="block text-sm font-semibold mb-1">Ad</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Soyad
                  </label>
                  <input
                    type="text"
                    defaultValue={user.surname}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Doğum Tarihi
                  </label>
                  <input
                    type="date"
                    defaultValue={user.birthdate}
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 rounded border border-white/40 bg-transparent focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="mt-8 text-right w-full">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-transparent border border-white/70 hover:bg-white/20 text-white font-bold py-2 px-4 rounded transition"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
