import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import ChatWindow from './components/ChatWindow';
import AuthContext from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 w-full h-full rounded-full border-4 border-t-blue-500 border-b-blue-200 border-l-blue-300 border-r-blue-400 animate-spin"></div>
          <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-purple-500 border-b-purple-200 border-l-purple-300 border-r-purple-400 animate-spin animation-delay-200"></div>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-screen"
                >
                  <ChatWindow />
                </motion.div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;