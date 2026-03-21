import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Dashboard/Dashboard.jsx";
import Chatbot from "./pages/Chatbot/Chatbot";
import "./App.css";
import Schedule from "./pages/Schedule/Schedule.jsx";
import Friends from "./pages/Friends/Friends.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/dashboard/ai" element={<Chatbot/>}/>
        <Route path="/dashboard/schedule" element={<Schedule/>}/>
        <Route path="/dashboard/friends" element={<Friends/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
