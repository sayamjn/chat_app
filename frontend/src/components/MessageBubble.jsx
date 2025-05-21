import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, currentUserId }) => {
  if (!message || !message.sender || !message.sender._id) {
    console.error('Invalid message structure:', message);
    return null;
  }
  
  const isSentByCurrentUser = message.sender._id === currentUserId;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isSentByCurrentUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tl-2xl rounded-tr-sm rounded-bl-2xl ml-auto'
            : 'bg-white shadow-sm rounded-tr-2xl rounded-tl-sm rounded-br-2xl border border-gray-200'
        } px-4 py-3 shadow-sm`}
      >
        {!isSentByCurrentUser && (
          <div className="font-semibold text-xs text-gray-500 mb-1">
            {message.sender.username}
          </div>
        )}
        <div className="break-words">{message.content}</div>
        <div
          className={`text-xs mt-1 text-right ${
            isSentByCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;