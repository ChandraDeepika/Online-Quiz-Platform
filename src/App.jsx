import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizCreate from './pages/QuizCreate';
import QuizAttempt from './pages/QuizAttempt';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<QuizCreate />} />
          <Route path="/quiz/:id" element={<QuizAttempt />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/analytics" element={<Analytics />} />
           
        </Routes>
      </Router>
    </AuthProvider>
  );
}