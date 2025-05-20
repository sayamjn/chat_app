import React from 'react';
import { motion } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';

const UserList = ({ users, onUserSelect, selectedUser, onlineUsers }) => {
  if (!users?.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
        <div className="text-center">
          <p className="text-lg mb-2">No users available</p>
          <p className="text-sm">Waiting for others to join</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full pb-6">
      <h2 className="font-bold text-lg px-6 pt-6 pb-3 border-b border-gray-200 dark:border-dark-600">
        Contacts
      </h2>
      <ul className="space-y-1 mt-3">
        {users.map((user) => (
          <motion.li
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onUserSelect(user)}
            className={`px-6 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
              selectedUser?._id === user._id
                ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-l-4 border-primary-500'
                : 'hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <FaCircle
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? 'text-green-500'
                      : 'text-gray-400'
                  }`}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;