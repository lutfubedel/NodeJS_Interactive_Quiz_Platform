import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./auth/signin";
import Login from "./auth/login";
import EmailVerification from "./auth/emailVerification";
import Terms from "./auth/terms";
import CreateProfile from "./auth/createProfile";
import Home from "./pages/Home";
import StartQuiz from "./pages/StartQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import { AuthProvider } from "./context/AuthContext"; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgetPassword" element={<EmailVerification />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/create_profile" element={<CreateProfile />} />
          <Route path="/startquiz" element={<StartQuiz />} />
          <Route path="/joinquiz" element={<JoinQuiz />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
