require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');


const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const activeUsers = new Map(); 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins (comes online)
  socket.on('join', ({ userId }) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is now online`);
    
    io.emit('userStatus', {
      userId,
      status: 'online'
    });
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId });
    }
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stopTyping', { senderId });
    }
  });

  socket.on('sendMessage', ({ senderId, receiverId, content }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', {
        senderId,
        content
      });
    }
  });

  socket.on('disconnect', () => {
    let userId = null;
    
    for (const [key, value] of activeUsers.entries()) {
      if (value === socket.id) {
        userId = key;
        break;
      }
    }
    
    if (userId) {
      activeUsers.delete(userId);
      console.log(`User ${userId} is now offline`);
      
      io.emit('userStatus', {
        userId,
        status: 'offline'
      });
    }
    
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});