import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserAlt, FaLock, FaUserPlus } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await register(username, password);
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-dark-800 dark:to-dark-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                ChatterBox
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new account</p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg"
              >
                <p>{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Choose a username"
                    required
                    minLength="3"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Create a password"
                    required
                    minLength="6"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters long
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FaUserPlus />
                <span>Register</span>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
            <p className="text-white text-center text-sm">
              Join ChatterBox today — Start chatting instantly with friends
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;