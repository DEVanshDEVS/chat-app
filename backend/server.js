const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('join', (username) => {
    users.set(socket.id, username);
    socket.broadcast.emit('user_joined', {
      username: username,
      message: `${username} joined the chat`
    });
    
    // Send current users list to the new user
    const usersList = Array.from(users.values());
    socket.emit('users_list', usersList);
    
    // Broadcast updated users list to all clients
    io.emit('users_update', usersList);
    
    console.log(`${username} joined the chat`);
  });

  // Handle new messages
  socket.on('send_message', (data) => {
    const username = users.get(socket.id);
    const messageData = {
      id: Date.now(),
      username: username,
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast message to all clients
    io.emit('receive_message', messageData);
    console.log(`Message from ${username}: ${data.message}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const username = users.get(socket.id);
    socket.broadcast.emit('user_typing', {
      username: username,
      isTyping: data.isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      socket.broadcast.emit('user_left', {
        username: username,
        message: `${username} left the chat`
      });
      
      // Broadcast updated users list
      const usersList = Array.from(users.values());
      io.emit('users_update', usersList);
      
      console.log(`${username} disconnected`);
    }
  });
});

// Basic API routes
app.get('/', (req, res) => {
  res.json({ message: 'Chat Server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connectedUsers: users.size
  });
});

const PORT = process.env.PORT || 3001;

// Listen on all interfaces (0.0.0.0) for external access
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Server accessible at http://0.0.0.0:${PORT}`);
});

