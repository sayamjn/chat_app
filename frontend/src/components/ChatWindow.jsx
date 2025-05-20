import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';
import { FaSignOutAlt, FaPaperPlane, FaChevronLeft, FaUsers, FaCircle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import UserList from './UserList';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showUserList, setShowUserList] = useState(true);
  const messagesEndRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowUserList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !user) return;

    // Join chat
    socket.emit('join', { userId: user._id });

    // Listen for user status
    socket.on('userStatus', ({ userId, status }) => {
      if (status === 'online') {
        setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      }
    });

    // Listen for new messages
    socket.on('newMessage', ({ senderId, content }) => {
      if (selectedUser && senderId === selectedUser._id) {
        const newMsg = {
          _id: Date.now(),
          content,
          sender: { _id: senderId, username: selectedUser.username },
          receiver: { _id: user._id, username: user.username },
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
      }
    });

    // Listen for typing indicator
    socket.on('typing', ({ senderId }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    // Listen for stop typing
    socket.on('stopTyping', ({ senderId }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('userStatus');
      socket.off('newMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, user, selectedUser]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/${selectedUser._id}`);
          setMessages(response.data);
          if (isMobileView) {
            setShowUserList(false);
          }
        } catch (error) {
          setError('Failed to fetch messages');
        }
      };

      fetchMessages();
    }
  }, [selectedUser, isMobileView]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
    setError('');
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && selectedUser) {
      // Clear existing timeout
      if (typingTimeout) clearTimeout(typingTimeout);

      // Emit typing event
      socket.emit('typing', { 
        senderId: user._id, 
        receiverId: selectedUser._id 
      });

      // Set timeout to stop typing after 2 seconds
      const timeout = setTimeout(() => {
        socket.emit('stopTyping', { 
          senderId: user._id, 
          receiverId: selectedUser._id 
        });
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Send message to server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        receiverId: selectedUser._id,
        content: newMessage
      });

      // Add message to the list
      setMessages(prev => [...prev, response.data]);
      
      // Emit message to socket server
      if (socket) {
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: selectedUser._id,
          content: newMessage
        });
      }

      // Clear input
      setNewMessage('');
      
      // Stop typing
      if (socket) {
        socket.emit('stopTyping', { 
          senderId: user._id, 
          receiverId: selectedUser._id 
        });
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    logout();
  };

  const toggleUserList = () => {
    setShowUserList(prev => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-dark-800">
      {/* Header */}
      <div className="bg-white dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
            ChatterBox
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 font-medium hidden sm:inline">{user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Mobile toggle button */}
        {isMobileView && !showUserList && (
          <button
            onClick={toggleUserList}
            className="fixed z-10 left-4 bottom-20 bg-primary-500 text-white p-3 rounded-full shadow-lg"
          >
            <FaUsers />
          </button>
        )}

        {/* User list sidebar */}
        <motion.div
          className={`${
            showUserList ? 'block' : 'hidden'
          } ${
            isMobileView ? 'fixed inset-0 z-20 bg-white dark:bg-dark-800' : 'w-80'
          } border-r border-gray-200 dark:border-dark-600`}
          initial={isMobileView ? { x: -300 } : false}
          animate={isMobileView ? { x: 0 } : false}
          transition={{ type: 'tween' }}
        >
          {isMobileView && (
            <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
              <h2 className="font-bold">Contacts</h2>
              <button onClick={toggleUserList} className="p-2">
                <FaChevronLeft />
              </button>
            </div>
          )}
          <UserList
            users={users}
            onUserSelect={handleUserSelect}
            selectedUser={selectedUser}
            onlineUsers={onlineUsers}
          />
        </motion.div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!showUserList || !isMobileView ? 'block' : 'hidden'}`}>
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 flex items-center">
                {isMobileView && (
                  <button onClick={toggleUserList} className="mr-3">
                    <FaChevronLeft />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <FaCircle
                        className={`text-xs ${
                          onlineUsers.includes(selectedUser._id)
                            ? 'text-green-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold">{selectedUser.username}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-dark-800">
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center p-6 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center">
                        <FaPaperPlane className="text-white text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                      <p>Send a message to start the conversation with {selectedUser.username}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        currentUserId={user._id}
                      />
                    ))}
                    <TypingIndicator
                      isTyping={isTyping}
                      username={selectedUser.username}
                    />
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder={
                      onlineUsers.includes(selectedUser._id)
                        ? "Type a message..."
                        : `${selectedUser.username} is offline`
                    }
                    disabled={!onlineUsers.includes(selectedUser._id)}
                    className="flex-1 py-3 px-4 rounded-l-lg border border-gray-300 dark:border-dark-600 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 dark:disabled:bg-dark-700 disabled:text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !onlineUsers.includes(selectedUser._id)}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-r-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md p-8 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Welcome to ChatterBox!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Select a user from the contacts list to start chatting.
                </p>
                {isMobileView && (
                  <button
                    onClick={toggleUserList}
                    className="btn-primary"
                  >
                    View Contacts
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;