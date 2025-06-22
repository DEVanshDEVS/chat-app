# Real-Time Chat Application

A modern, real-time chat application built with React and Node.js, featuring Socket.IO for instant messaging capabilities.

## Features

- **Real-time messaging** - Messages appear instantly for all connected users
- **User management** - See who's online with live user count
- **Typing indicators** - Know when someone is typing
- **Connection status** - Visual indicator of connection state
- **Responsive design** - Works on desktop and mobile devices
- **Modern UI** - Clean, professional interface with Tailwind CSS and shadcn/ui components
- **System notifications** - Alerts when users join or leave the chat

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **CORS** - Cross-origin resource sharing support

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Lucide React** - Beautiful icons
- **Socket.IO Client** - Real-time communication

## Project Structure

```
chat-app/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   ├── main.jsx       # Entry point
│   │   └── components/    # UI components
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── node_modules/      # Frontend dependencies
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:3001`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already installed):
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev --host
   ```
   The frontend will be available at `http://localhost:5173` or `http://localhost:5174`

## Usage

1. **Start both servers** - Make sure both backend and frontend are running
2. **Open the application** - Navigate to the frontend URL in your browser
3. **Enter username** - Type your desired username and click "Join Chat"
4. **Start chatting** - Type messages and press Enter or click the send button
5. **Multiple users** - Open multiple browser tabs/windows to simulate multiple users

## API Endpoints

### Backend Routes
- `GET /` - Server status check
- `GET /health` - Health check with connection info

### Socket.IO Events
- `join` - User joins the chat
- `send_message` - Send a message
- `receive_message` - Receive a message
- `typing` - Typing indicator
- `user_joined` - User joined notification
- `user_left` - User left notification
- `users_list` - Current users list
- `users_update` - Updated users list

## Configuration

### Backend Configuration
The backend server is configured to:
- Listen on port 3001 (configurable via PORT environment variable)
- Accept connections from any origin (CORS enabled)
- Listen on all network interfaces (0.0.0.0)

### Frontend Configuration
The frontend is configured to:
- Connect to `http://localhost:3001` for Socket.IO
- Use Vite for development with hot reload
- Support responsive design for mobile and desktop

## Development

### Running in Development Mode
Both servers support hot reload for development:
- Backend: Uses `nodemon` for automatic restart on file changes
- Frontend: Uses Vite's built-in hot module replacement

### Building for Production
To build the frontend for production:
```bash
cd frontend
pnpm run build
```

## Features in Detail

### Real-time Communication
- Uses Socket.IO for WebSocket-based real-time communication
- Automatic reconnection on connection loss
- Connection status indicator

### User Interface
- Modern, clean design with gradient backgrounds
- Responsive layout that works on all screen sizes
- Smooth animations and transitions
- Professional color scheme with light/dark mode support

### Message Features
- Timestamps on all messages
- User identification with different styling for own messages
- System messages for user join/leave events
- Typing indicators with timeout

### User Management
- Live user count
- Online users list with visual indicators
- Automatic cleanup when users disconnect

## Troubleshooting

### Common Issues
1. **Connection refused** - Make sure the backend server is running on port 3001
2. **CORS errors** - The backend is configured to allow all origins
3. **Port conflicts** - Vite will automatically use the next available port
4. **Socket connection issues** - Check that both frontend and backend are running

### Logs
- Backend logs show user connections, messages, and server status
- Frontend console shows Socket.IO connection status and errors

## Future Enhancements

Potential features that could be added:
- User authentication and persistent sessions
- Message history and persistence
- Private messaging
- File sharing
- Emoji support
- Message reactions
- User profiles and avatars
- Chat rooms/channels
- Message encryption

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for implementation details.

