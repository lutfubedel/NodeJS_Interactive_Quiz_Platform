const Background = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        background: "linear-gradient(to right, #60a5fa, #ec4899)", // Tailwind -> from-blue-400 to-pink-500
      }}
    />
  );
};

export default Background;
