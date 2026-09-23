import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch accepted connections (matches that are connected or accepted requests)
    // For simplicity here, we'll fetch accepted requests where user is either sender or receiver
    const fetchConnections = async () => {
      try {
        const [receivedRes, sentRes] = await Promise.all([
          api.get('/requests/received'),
          api.get('/requests/sent')
        ]);
        
        const acceptedReceived = receivedRes.data.filter(r => r.status === 'accepted').map(r => ({
          userId: r.senderId._id,
          name: r.senderId.name,
          flatId: r.flatId._id,
          flatTitle: r.flatId.title
        }));
        
        const acceptedSent = sentRes.data.filter(r => r.status === 'accepted').map(r => ({
          userId: r.receiverId._id,
          name: r.receiverId.name,
          flatId: r.flatId._id,
          flatTitle: r.flatId.title
        }));
        
        setConnections([...acceptedReceived, ...acceptedSent]);
      } catch (err) {
        console.error("Error fetching connections", err);
      }
    };
    
    fetchConnections();
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!activeChat) return;
    try {
      const { data } = await api.get(`/messages/${activeChat.userId}/${activeChat.flatId}`);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      await api.post('/messages', {
        receiverId: activeChat.userId,
        flatId: activeChat.flatId,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages(); // instantly fetch to show
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-8 px-6">
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex h-[calc(100vh-140px)]">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/40">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold">Messages</h2>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {connections.length > 0 ? connections.map((conn, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveChat(conn)}
                className={`p-4 border-b border-white/5 cursor-pointer transition flex items-center gap-4 ${activeChat?.userId === conn.userId && activeChat?.flatId === conn.flatId ? 'bg-pink-600/20 border-l-4 border-l-pink-500' : 'hover:bg-white/5'}`}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl shrink-0">
                  {conn.name[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{conn.name}</h3>
                  <p className="text-xs text-white/50 truncate">Re: {conn.flatTitle}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-white/40">
                No connections yet. Go accept some requests!
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col relative bg-gradient-to-b from-black to-pink-950/20">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                  {activeChat.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{activeChat.name}</h3>
                  <p className="text-xs text-pink-400">Discussing: {activeChat.flatTitle}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user._id || msg.senderId._id === user._id || msg.senderId === user.id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-pink-600 text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                        <p>{msg.message}</p>
                        <span className="text-[10px] opacity-60 mt-1 block text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition"
                />
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 w-12 rounded-xl flex items-center justify-center transition shrink-0 shadow-lg shadow-pink-500/25">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Messages;
