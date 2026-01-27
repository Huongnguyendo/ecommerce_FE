import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fade,
  Slide,
  Chip,
  Stack,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Help as HelpIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Mic as MicIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../redux/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    // Try to restore sessionId from localStorage
    return localStorage.getItem('chatSessionId') || null;
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [showHelpToast, setShowHelpToast] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(state => state.auth.user);

  const saveMessagesToLocalStorage = (msgs, sid) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(msgs));
      if (sid) {
        localStorage.setItem('chatSessionId', sid);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving messages to localStorage:', error);
      }
    }
  };

  const loadMessagesFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('chatMessages');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading messages from localStorage:', error);
      }
    }
    return [];
  };


  // Quick action buttons with better styling
  const quickActions = [
    { text: "Search", icon: <SearchIcon sx={{ fontSize: 16 }} />, action: "search", color: "#1976d2" },
    { text: "Cart", icon: <CartIcon sx={{ fontSize: 16 }} />, action: "cart", color: "#2e7d32" },
    { text: "Shipping", icon: <ShippingIcon sx={{ fontSize: 16 }} />, action: "shipping", color: "#ed6c02" },
    { text: "Payment", icon: <PaymentIcon sx={{ fontSize: 16 }} />, action: "payment", color: "#9c27b0" },
    { text: "Help", icon: <HelpIcon sx={{ fontSize: 16 }} />, action: "help", color: "#d32f2f" }
  ];

  // Get bot response from backend API
  const getBotResponse = async (userMessage) => {
    try {
      const response = await api.post('/chatbot/response', { 
        message: userMessage, 
        sessionId: sessionId 
      });
      
      const newSessionId = response.data.data.sessionId;
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem('chatSessionId', newSessionId);
      }
      
      return response.data.data.response;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Chatbot API error:', error);
      }
      return "I'm having trouble processing your request right now. Please try again or contact our support team directly.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    const newMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message immediately
    const messagesWithUser = [...messages, newMessage];
    setMessages(messagesWithUser);
    saveMessagesToLocalStorage(messagesWithUser, sessionId);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Add bot message to the messages that already include the user message
      const messagesWithBoth = [...messagesWithUser, botMessage];
      setMessages(messagesWithBoth);
      saveMessagesToLocalStorage(messagesWithBoth, sessionId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting bot response:', error);
      }
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      // Add error message to the messages that already include the user message
      const messagesWithError = [...messagesWithUser, errorMessage];
      setMessages(messagesWithError);
      saveMessagesToLocalStorage(messagesWithError, sessionId);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'search':
        message = "I want to search for products";
        break;
      case 'cart':
        message = "Show me my cart";
        break;
      case 'shipping':
        message = "Tell me about shipping";
        break;
      case 'payment':
        message = "Help with payment";
        break;
      case 'help':
        message = "I need help";
        break;
      default:
        message = "Help me";
    }
    setInputValue(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    // Clear messages state
    setMessages([]);
    // Clear localStorage
    localStorage.removeItem('chatMessages');
    // Reset session ID
    const newSessionId = `temp_${Date.now()}_${Math.random()}`;
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    // Add welcome message back
    const welcomeMessage = {
      id: 1,
      text: `Hello${currentUser ? ` ${currentUser.name}` : ''}! 👋 I'm your AI shopping assistant. I can help you find products, answer questions, and provide recommendations. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  // Clear chat when user logs in (transition from anonymous to authenticated)
  useEffect(() => {
    if (currentUser) {
      // Check if localStorage was cleared (happens on login)
      const hasLocalStorageChat = localStorage.getItem('chatMessages');
      if (!hasLocalStorageChat && messages.length > 0) {
        // Clear UI state and show fresh welcome message
        setMessages([]);
        const newSessionId = `temp_${Date.now()}_${Math.random()}`;
        setSessionId(newSessionId);
      }
    }
  }, [currentUser]); // Only run when currentUser changes

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const localMessages = loadMessagesFromLocalStorage();
      if (localMessages.length > 0) {
        setMessages(localMessages);
        const savedSessionId = localStorage.getItem('chatSessionId');
        if (savedSessionId) {
          setSessionId(savedSessionId);
        }
      } else {
        const welcomeMessage = {
          id: 1,
          text: `Hello${currentUser ? ` ${currentUser.name}` : ''}! 👋 I'm your AI shopping assistant. I can help you find products, answer questions, and provide recommendations. How can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, currentUser, messages.length]);

  // Update unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setUnreadCount(prev => prev + 1);
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen, messages.length]);

  // Hide chat widget for admin and seller users
  if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Seller')) {
    return null;
  }

  // Optionally hide chatbot entirely if disabled via environment variable
  // This can be set in the backend .env file: ENABLE_CHATBOT=false
  // For now, we'll keep it visible but it won't make API calls if disabled

  return (
    <>
        {/* Enhanced Chat Button with Badge */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: { xs: 24, sm: 24 },
            mr: { xs: 2, sm: 0 },
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
        {/* Help Toast */}
        {showHelpToast && (
          <Fade in={showHelpToast}>
            <Box
              sx={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafb 100%)',
                color: '#333',
                px: 3,
                py: 2,
                borderRadius: 4,
                maxWidth: 280,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  '0%': { 
                    opacity: 0, 
                    transform: 'translateY(20px) scale(0.9)' 
                  },
                  '100%': { 
                    opacity: 1, 
                    transform: 'translateY(0) scale(1)' 
                  },
                },
              }}
            >
              {/* Close Button */}
              <IconButton
                size="small"
                onClick={() => setShowHelpToast(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    color: '#333',
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
              
              {/* Content */}
              <Box sx={{ pr: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    mb: 0.5,
                    lineHeight: 1.2,
                  }}
                >
                  Need Help?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: '0.8rem',
                    lineHeight: 1.3,
                  }}
                >
                  Click the chat icon to talk with our AI assistant.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
        <Fade in={!isOpen}>
          <Tooltip 
            title="Get instant help with products, orders, and recommendations!" 
            arrow
            placement="top"
            enterDelay={500}
            leaveDelay={200}
            PopperProps={{
              style: {
                zIndex: 9999,
              }
            }}
            sx={{
              '& .MuiTooltip-tooltip': {
                fontSize: '0.85rem',
                maxWidth: 280,
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                fontWeight: 500,
                padding: '12px 16px',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.3s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(0, 0, 0, 0.9)',
              }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              invisible={unreadCount === 0}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  height: 20,
                  minWidth: 20,
                  fontWeight: 'bold',
                }
              }}
            >
              <IconButton
                onClick={() => setIsOpen(true)}
                sx={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #a8a8ff 0%, #8b5cf6 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(168, 168, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #9d9dff 0%, #7c3aed 100%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 40px rgba(168, 168, 255, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.3)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'pulse 2s infinite, bounce 3s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 8px 32px rgba(168, 168, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    },
                    '50%': {
                      boxShadow: '0 8px 32px rgba(168, 168, 255, 0.6), 0 0 0 8px rgba(168, 168, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                    },
                    '100%': {
                      boxShadow: '0 8px 32px rgba(168, 168, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '40%': {
                      transform: 'translateY(-8px)',
                    },
                    '60%': {
                      transform: 'translateY(-4px)',
                    },
                  },
                }}
              >
                <ChatIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Badge>
          </Tooltip>
        </Fade>
      </Box>

      {/* Enhanced Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 24,
            right: { xs: 24, sm: 24 },
            mr: { xs: 2, sm: 0 },
            width: { xs: 'calc(100vw - 48px)', sm: 420 },
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafb 100%)',
          }}
        >
          {/* Enhanced Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #a8a8ff 0%, #8b5cf6 100%)',
              color: 'white',
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 40, 
                  height: 40,
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <BotIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem' }}>
                  AI Shopping Assistant
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: '#4caf50',
                      animation: 'pulse 2s infinite',
                    }} 
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                    Online • AI Powered
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Clear chat" arrow>
                <IconButton 
                  onClick={handleClearChat}
                  sx={{ 
                    color: 'white',
                    opacity: 0.8,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      opacity: 1
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close chat" arrow>
                <IconButton 
                  onClick={() => setIsOpen(false)}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Enhanced Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              background: 'linear-gradient(180deg, #f8fafb 0%, #ffffff 100%)',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '3px',
              },
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    maxWidth: '85%',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #a8a8ff 0%, #8b5cf6 100%)' 
                        : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      border: '2px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {message.sender === 'user' ? <PersonIcon sx={{ fontSize: 18 }} /> : <BotIcon sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #a8a8ff 0%, #8b5cf6 100%)' 
                        : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 3,
                      boxShadow: message.sender === 'user' 
                        ? '0 4px 20px rgba(168, 168, 255, 0.3)' 
                        : '0 4px 20px rgba(0,0,0,0.08)',
                      border: message.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)',
                      position: 'relative',
                      '&::before': message.sender === 'user' ? {
                        content: '""',
                        position: 'absolute',
                        top: 12,
                        right: -8,
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid #a8a8ff',
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                      } : {
                        content: '""',
                        position: 'absolute',
                        top: 12,
                        left: -8,
                        width: 0,
                        height: 0,
                        borderRight: '8px solid white',
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {/* Enhanced Typing indicator */}
            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    border: '2px solid rgba(255,255,255,0.8)',
                  }}>
                    <BotIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2.5,
                      bgcolor: 'white',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.9rem' }}>
                        Thinking
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: '#4caf50',
                              animation: 'typing 1.4s infinite',
                              animationDelay: `${i * 0.2}s`,
                              '@keyframes typing': {
                                '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
                                '30%': { transform: 'translateY(-10px)', opacity: 1 },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Enhanced Quick Actions */}
          <Box sx={{ 
            p: 2.5, 
            bgcolor: 'white', 
            borderTop: '1px solid rgba(0,0,0,0.05)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontWeight: 600 }}>
              Quick actions:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {quickActions.map((action, index) => (
                <Chip
                  key={index}
                  label={action.text}
                  icon={action.icon}
                  size="small"
                  onClick={() => handleQuickAction(action.action)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: 'white',
                    border: `1px solid ${action.color}20`,
                    color: action.color,
                    fontWeight: 500,
                    '&:hover': { 
                      bgcolor: action.color, 
                      color: 'white',
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${action.color}40`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Enhanced Input Area */}
          <Box sx={{ 
            p: 2.5, 
            bgcolor: 'white', 
            borderTop: '1px solid rgba(0,0,0,0.05)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Tooltip title="Attach file" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'primary.light', color: 'primary.main' }
                  }}
                >
                  <AttachIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8fafb',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: '#1a1a1a',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#1a1a1a',
                  },
                }}
              />
              <Tooltip title="Voice message" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'primary.light', color: 'primary.main' }
                  }}
                >
                  <MicIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  width: 44,
                  height: 44,
                  '&:hover': { 
                    bgcolor: 'linear-gradient(135deg, #ff5252 0%, #d63031 100%)',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': { 
                    bgcolor: 'grey.300',
                    transform: 'none',
                  },
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                }}
              >
                <SendIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default ChatWidget;