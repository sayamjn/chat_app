import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ isTyping, username, darkMode }) => {
  if (!isTyping) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center mb-4 text-gray-500 dark:text-gray-400"
    >
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm flex items-center">
        <span className="mr-2">{username} is typing</span>
        <div className="flex space-x-1">
          <motion.div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
          ></motion.div>
          <motion.div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          ></motion.div>
          <motion.div
            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;