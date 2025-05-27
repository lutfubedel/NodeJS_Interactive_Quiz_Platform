import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginWithMail, signInWithGoogle } from "../../firebase";
import { motion } from "framer-motion"; // 🆕 Burada motion import edildi

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/statistics");
    // try {
    //   const user = await loginWithMail(email, password, navigate);
    //   if (user) {
    //     const userData = { email, token: user.uid };
    //     rememberMe
    //       ? localStorage.setItem("user", JSON.stringify(userData))
    //       : sessionStorage.setItem("user", JSON.stringify(userData));
    //   }
    // } catch (error) {
    //   toast.error("Login failed");
    //   console.log(error);
    // }
  };

  const googleAuthFunc = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle(navigate);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
    } catch (error) {
      toast.error("Registration failed:", error.message);
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
      {/* 🎥 motion.div ile animasyon eklendi */}
      <motion.div
        className="w-full max-w-md p-12 bg-white border border-gray-300 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900">
          Quiz Platforma Hoş Geldin!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgetPassword")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <div className="w-24 border-t border-gray-300"></div>
          <span className="px-5 text-gray-500">Or continue with</span>
          <div className="w-24 border-t border-gray-300"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={googleAuthFunc}
            className="flex items-center border-2 border-gray-300 px-6 py-2 rounded-lg text-gray-900 hover:bg-gray-100 hover:border-gray-600 gap-x-2"
          >
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              alt="Google Logo"
              className="h-8 w-8"
            />
            Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href="./signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register Now
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
