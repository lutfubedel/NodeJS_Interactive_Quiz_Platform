import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaPlus,
  FaQuestionCircle,
  FaCog,
  FaHistory,
  FaChartBar,
  FaSignOutAlt,
  FaPlayCircle,
  FaBullseye,
  FaAngleDoubleLeft,
  FaClipboardList,
  FaAngleDoubleRight,
} from "react-icons/fa";

const menuItems = [
  { to: "/profile", icon: <FaUser />, label: "Profil" },
  { to: "/joinquiz", icon: <FaPlayCircle />, label: "Quize Katıl" },
  { to: "/quiz-selection", icon: <FaBullseye />, label: "Quiz Başlat" },
  { to: "/create-quiz", icon: <FaPlus />, label: "Quiz Oluştur" },
  { to: "/quiz-history", icon: <FaHistory />, label: "Quiz Geçmişi" },
  { to: "/question-bank", icon: <FaQuestionCircle />, label: "Soru Bankası" },
  { to: "/statistics", icon: <FaChartBar />, label: "İstatistikler" },
];

// Logout fonksiyonu
function handleLogout(navigate) {
  if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        console.error("Çıkış yapılamadı:", error);
        alert("Çıkış sırasında bir hata oluştu.");
      });
  }
}

export function DesktopSidebar({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();

  const sidebarVariants = {
    open: {
      width: 260,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: 64,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-600 to-pink-400 text-white flex flex-col select-none z-20"
      variants={sidebarVariants}
      initial={false}
      animate={isCollapsed ? "closed" : "open"}
      style={{ overflow: "hidden" }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-white/30"
        style={{ minHeight: 40 }}
      >
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Menüyü aç" : "Menüyü kapat"}
          className="text-white text-xl focus:outline-none"
        >
          {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
        {!isCollapsed && (
          <span
            className="font-bold text-lg select-none"
            style={{ userSelect: "none", lineHeight: "1" }}
          >
            Menü
          </span>
        )}
        <div style={{ width: 24 }} />
      </div>

      <nav className="flex flex-col mt-4 gap-2 px-1">
        {menuItems.map(({ to, icon, label }, i) => (
          <Link
            key={i}
            to={to}
            className={`relative flex items-center cursor-pointer rounded-xl transition-colors 
              hover:bg-white hover:text-indigo-600
              ${
                isCollapsed
                  ? "justify-center p-3 w-10 h-10 mx-auto"
                  : "p-3 pl-6 w-auto"
              }`}
            style={{ height: 48 }}
          >
            <div className="flex justify-center items-center w-6 h-6 flex-shrink-0">
              {icon}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 whitespace-nowrap overflow-hidden select-none"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}

        {/* 🚪 Logout butonu ayrı */}
        <button
          onClick={() => handleLogout(navigate)}
          className={`relative flex items-center cursor-pointer rounded-xl transition-colors 
            hover:bg-white hover:text-indigo-600 text-white
            ${
              isCollapsed
                ? "justify-center p-3 w-10 h-10 mx-auto"
                : "p-3 pl-6 w-auto"
            }`}
          style={{ height: 48 }}
        >
          <div className="flex justify-center items-center w-6 h-6 flex-shrink-0">
            <FaSignOutAlt />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-4 whitespace-nowrap overflow-hidden select-none"
              >
                Çıkış Yap
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>
    </motion.div>
  );
}

export function MobileSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white focus:outline-none"
          aria-label="Menüyü aç"
        >
          <FaBars />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-indigo-600 to-pink-400 text-white z-40 flex flex-col select-none shadow-lg"
          >
            <div className="flex items-center justify-between px-3 py-4 border-b border-white/30">
              <span className="font-bold text-lg">Menü</span>
              <button
                onClick={toggleSidebar}
                aria-label="Menüyü kapat"
                className="text-white text-xl focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col h-full px-2 py-2 gap-3">
              {menuItems.map(({ to, icon, label }, i) => (
                <Link
                  key={i}
                  to={to}
                  className="flex items-center justify-start p-3 rounded-lg cursor-pointer w-full flex-grow
                    bg-white text-indigo-600 border border-gray-300
                    hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                  style={{ minHeight: 48 }}
                >
                  <div className="flex justify-center items-center w-6 h-6 mr-4 text-indigo-600">
                    {icon}
                  </div>
                  <span className="whitespace-nowrap overflow-hidden">
                    {label}
                  </span>
                </Link>
              ))}

              {/* 🚪 Logout butonu ayrı */}
              <button
                onClick={() => handleLogout(navigate)}
                className="flex items-center justify-start p-3 rounded-lg cursor-pointer w-full
                  bg-white text-indigo-600 border border-gray-300
                  hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                style={{ minHeight: 48 }}
              >
                <div className="flex justify-center items-center w-6 h-6 mr-4 text-indigo-600">
                  <FaSignOutAlt />
                </div>
                <span className="whitespace-nowrap overflow-hidden">
                  Çıkış Yap
                </span>
              </button>
            </nav>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Sidebar() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const toggleDesktopSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  return isMobile ? (
    <MobileSidebar isOpen={mobileOpen} toggleSidebar={toggleMobileSidebar} />
  ) : (
    <DesktopSidebar
      isCollapsed={isCollapsed}
      toggleSidebar={toggleDesktopSidebar}
    />
  );
}
