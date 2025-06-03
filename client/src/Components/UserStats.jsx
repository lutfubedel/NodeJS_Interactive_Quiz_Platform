import { useEffect, useState } from "react";
import {
  FaQuestionCircle,
  FaHeart,
  FaCheck,
  FaTimes,
  FaPlusCircle,
  FaClipboardList,
} from "react-icons/fa";

const UserStats = () => {
  const [stats, setStats] = useState({
    quizzesJoined: 0,
    quizzesCreated: 0,
    correctAnswers: 0,
    likedQuestions: 0,
    dislikedQuestions: 0,
    questionsUsed: 0,
  });

  useEffect(() => {
    const randomInt = (max) => Math.floor(Math.random() * max) + 1;

    setStats({
      quizzesJoined: randomInt(30),
      quizzesCreated: randomInt(10),
      correctAnswers: randomInt(100),
      likedQuestions: randomInt(50),
      dislikedQuestions: randomInt(20),
      questionsUsed: randomInt(40),
    });
  }, []);

  const statCards = [
    {
      label: "Katıldığı Quiz",
      value: stats.quizzesJoined,
      icon: <FaClipboardList />,
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "Oluşturduğu Quiz",
      value: stats.quizzesCreated,
      icon: <FaPlusCircle />,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Doğru Cevap",
      value: stats.correctAnswers,
      icon: <FaCheck />,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Beğenilen Soru",
      value: stats.likedQuestions,
      icon: <FaHeart />,
      color: "from-pink-400 to-pink-600",
    },
    {
      label: "Beğenilmeyen Soru",
      value: stats.dislikedQuestions,
      icon: <FaTimes />,
      color: "from-red-400 to-red-600",
    },
    {
      label: "Kullanılan Soru",
      value: stats.questionsUsed,
      icon: <FaQuestionCircle />,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-md p-6 flex justify-center items-center gap-4 transform transition duration-300 hover:scale-105`}
        >
          <div className="text-4xl">{card.icon}</div>
          <div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
