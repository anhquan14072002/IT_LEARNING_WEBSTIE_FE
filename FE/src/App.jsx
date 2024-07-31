import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginAdmin from './pages/LoginAdmin';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Search from './pages/Search';
import CheckMail from './pages/CheckMail';
import Document from './pages/Document';
import Lesson from './pages/Lesson';
import Topic from './pages/Topic';
import ChangePassword from './pages/ChangePassword';
import Quiz from './pages/Quiz';
import FlashCard from './pages/FlashCard';
import TestQuizPage from './pages/TestQuizPage';
import ExamCodeDetail from './pages/ExamCodeDetail';
import ExamDetail from './pages/ExamDetail';
import ExamResult from './pages/ExamResult';
import ManageQuestionOfQuizlist from './pages/ManageQuestionOfQuizlist';
import AddQuestionOfQuizlist from './pages/AddQuestionOfQuizlist';
import ViewExam from './pages/ViewExam';


function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/dashboard/:typeId" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/document/:id" element={<Document />} />
        <Route path="/topic/:id" element={<Topic />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/testquiz/:id" element={<TestQuizPage />} />
        <Route path="/document/lesson/:id" element={<Lesson />} />
        <Route path="/flashcard/:id" element={<FlashCard />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkmail" element={<CheckMail />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/examcodedetail/:id" element={<ExamCodeDetail />} />
        <Route path="/examdetail/:id" element={<ExamDetail />} />
        <Route path="/examresult/:id" element={<ExamResult />} />
        <Route path="/dashboard/quiz/managequestionofquizlist/:id" element={<ManageQuestionOfQuizlist />}/>
        <Route path="/dashboard/quiz/addquestionofquizlist/:id" element={<AddQuestionOfQuizlist/>}/>
        <Route path="/viewexam" element={<ViewExam />} />
        </Routes>
    </Router>
  );
}

export default App;