import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Send, Users, MessageCircle } from 'lucide-react'
import './App.css'

const SOCKET_SERVER_URL = 'http://localhost:3001'

function App() {
  const [socket, setSocket] = useState(null)
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isLoggedIn && username) {
      const newSocket = io(SOCKET_SERVER_URL)
      setSocket(newSocket)

      newSocket.on('connect', () => {
        setIsConnected(true)
        newSocket.emit('join', username)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data])
      })

      newSocket.on('user_joined', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: 'System',
          message: data.message,
          timestamp: new Date().toISOString(),
          isSystem: true
        }])
      })

      newSocket.on('user_left', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: 'System',
          message: data.message,
          timestamp: new Date().toISOString(),
          isSystem: true
        }])
      })

      newSocket.on('users_list', (usersList) => {
        setUsers(usersList)
      })

      newSocket.on('users_update', (usersList) => {
        setUsers(usersList)
      })

      newSocket.on('user_typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username])
        } else {
          setTypingUsers(prev => prev.filter(u => u !== data.username))
        }
      })

      return () => {
        newSocket.close()
      }
    }
  }, [isLoggedIn, username])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoggedIn(true)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && socket) {
      socket.emit('send_message', { message: message.trim() })
      setMessage('')
      
      // Stop typing indicator
      socket.emit('typing', { isTyping: false })
    }
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)
    
    if (socket) {
      socket.emit('typing', { isTyping: true })
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { isTyping: false })
      }, 1000)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MessageCircle className="h-6 w-6" />
              Join Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  maxLength={20}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Join Chat
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Room
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isSystem
                          ? 'bg-muted text-muted-foreground text-center text-sm'
                          : msg.username === username
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {!msg.isSystem && (
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">
                            {msg.username}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={handleTyping}
                  className="flex-1"
                  disabled={!isConnected}
                />
                <Button type="submit" disabled={!message.trim() || !isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        
        {/* Users Sidebar */}
        <Card className="w-64 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Users
              <Badge variant="secondary">{users.length}</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      user === username ? 'bg-primary/10' : 'bg-muted/50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">
                      {user} {user === username && '(You)'}
                    </span>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users online
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

