import "./App.css";
import { useEffect } from "react";
import socket from "./socket"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./auth/signin";
import Login from "./auth/login";
import EmailVerification from "./auth/emailVerification";
import Terms from "./auth/terms";
import CreateProfile from "./auth/createProfile";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";
import JoinQuiz from "./pages/JoinQuiz";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import QuestionBankPage from "./pages/QuestionBank/main_page";
import QuestionsPage from "./pages/QuestionBank/question_bank_inside";
import QuizHistoryPage from "./pages/Quiz Pages/quizHistoryPage";
import CreatedQuizzesPage from "./pages/Quiz Pages/createdQuizzesPage";
import JoinedQuizzesPage from "./pages/Quiz Pages/joinedQuizzesPage";
import CreateQuizPage from "./pages/Quiz Pages/createQuizPage";
import AddQuestionsPage from "./pages/Quiz Pages/addQuestionPage";
import QuizSelectionPage from "./pages/SelectQuiz";
import StartQuizPage from "./pages/StartQuiz";
import QuizRoomPage from "./pages/QuizRoom";

function App() {



  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgetPassword" element={<EmailVerification />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/question-bank" element={<QuestionBankPage />} />
          <Route path="/question-bank/:bankId" element={<QuestionsPage />} />
          <Route path="/quiz-selection" element={<QuizSelectionPage />} />
          <Route path="/start-quiz/:quizId" element={<StartQuizPage />} />
          <Route path="/quiz-room/:roomCode" element={<QuizRoomPage />} />

          <Route
            path="/quiz-history/created-quizzes"
            element={<CreatedQuizzesPage />}
          />

          <Route
            path="/add-questions"
            element={<AddQuestionsPage />}
          />
          <Route
            path="/quiz-history/joined-quizzes"
            element={<JoinedQuizzesPage />}
          />

          <Route path="/quiz-history" element={<QuizHistoryPage />} />
          <Route path="/create_profile" element={<CreateProfile />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/joinquiz" element={<JoinQuiz />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
