import Header from "./Components/Header";
import Home from "./Components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import AdminDashboard from "./Components/AdminComponent/AdminDashboard";
import UserList from "./Components/AdminComponent/UserList";
import ExamList from "./Components/ExamComponent/ExamList";
import QuizComponent from "./Components/ExamComponent/QuizComponent";
import './App.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <nav>
        <Header />
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:examId/:userId" element={<QuizComponent />} />
        <Route path="/home" element={<Home />} />
        <Route path="/adminPanel" element={<AdminDashboard />} />
        <Route path="/test" element={<UserList />} />
        <Route path="/examlist/:userId" element={<ExamList />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
