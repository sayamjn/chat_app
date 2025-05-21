# ChatterBox - MERN Stack Real-Time Chat Application

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO.

## ✨ Features

- **User Authentication**: Secure signup and login with JWT
- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **Online/Offline Status**: See when users are available in real-time
- **Typing Indicators**: Know when someone is composing a message

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API server
- **MongoDB with Mongoose**: Database and schemas
- **Socket.IO**: Real-time communication

### Frontend
- **React (Vite)**: UI framework with fast development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Socket.IO Client**: Real-time communication with server

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas account)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sayamjn/chat_app.git
   cd chat_app
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chat_app
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

## 📱 Usage

1. Open your browser and navigate to http://localhost:5173
2. Register a new account or login with existing credentials
3. See the list of available users on the left sidebar
4. Click on a user to start a conversation
5. The green dot indicator shows which users are currently online
6. When a user is typing, you'll see a "User is typing..." indicator


## ⚙️ Key Configuration Files

- `backend/.env`: Backend environment variables
- `frontend/.env`: Frontend environment variables
- `backend/server.js`: Socket.IO and Express server configuration
- `frontend/src/context/AuthContext.jsx`: Authentication state management



## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [Socket.IO](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the frontend library
- [Express](https://expressjs.com/) for the backend framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling
