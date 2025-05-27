import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import UserStats from "../Components/UserStats";
import Background from "../Components/Background";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsExpanded(false); // masaüstünde expanded sidebar default kapalı
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarCollapsedWidth = 64;

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
          {/* Bu div'i kaldır */}
          {/* <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={() => setIsExpanded(false)}
    /> */}
        </>
      )}

      {/* Main içerik: her zaman collapsed sidebar kadar sol boşluk bırakıyor */}
      <main
        className="flex-1 p-10 overflow-auto"
        style={{
          marginLeft: sidebarCollapsedWidth,
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

export default Dashboard;
