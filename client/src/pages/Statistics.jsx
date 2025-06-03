import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import UserStats from "../Components/UserStats";
import Background from "../Components/Background";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Staistics = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const control = window.innerWidth < 640;

  useEffect(() => {
    console.log("Firebase kullanıcısı:", currentUser);
    console.log("MongoDB'den gelen kullanıcı verisi:", userData);

    // Kullanıcı yoksa otomatik ana sayfaya sayfasına geçer.
    if (currentUser == null || userData == null) {
      console.log("User Bulunamadı");
      navigate("/home");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsExpanded(true); // masaüstünde expanded sidebar default kapalı
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentUser, userData]);

  return (
    <div className="flex min-h-screen relative bg-gradient-to-r from-blue-400 to-pink-500 text-white">
      <Background />

      {/* Küçük sidebar her zaman visible */}
      <Sidebar
        isCollapsed={true}
        toggleSidebar={() => setIsExpanded(true)} // küçük sidebardaki buton büyük sidebarı açar
        isMobile={false} // collapsed her zaman büyük ekran gibi davranacak
      />

      {/* Büyük sidebar, overlay gibi açılıp kapanacak */}
      {isExpanded && (
        <>
          <Sidebar
            isCollapsed={false}
            toggleSidebar={() => setIsExpanded(false)}
            isMobile={true}
          />
        </>
      )}

      {/* Main içerik: her zaman collapsed sidebar kadar sol boşluk bırakıyor */}
      <main
        className="flex-1 p-10 overflow-auto"
        style={{
          marginLeft: control ? "0px" : "60px",
          marginTop: control ? "10px" : "0px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Kullanıcı İstatistikleri
          </h1>
          <UserStats />
        </motion.div>
      </main>
    </div>
  );
};

export default Staistics;
