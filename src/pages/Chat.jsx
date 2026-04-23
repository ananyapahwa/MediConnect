import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MessageSquare, Search, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialDoctorId = searchParams.get('doctorId');
    const initialDoctorName = searchParams.get('doctorName');

    const [currentUser, setCurrentUser] = useState(null);
    const [inbox, setInbox] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null); // { otherUserId, otherUserName }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const pollingRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setCurrentUser(user);
        fetchInbox(token);

        // If navigated with a doctorId, open that conversation directly
        if (initialDoctorId && initialDoctorName) {
            setSelectedConversation({ otherUserId: initialDoctorId, otherUserName: `Dr. ${initialDoctorName}` });
        }
    }, [navigate, initialDoctorId, initialDoctorName]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.otherUserId);
            // Poll for new messages every 4 seconds
            pollingRef.current = setInterval(() => {
                fetchMessages(selectedConversation.otherUserId, true);
            }, 4000);
        }
        return () => clearInterval(pollingRef.current);
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchInbox = async (token) => {
        try {
            const res = await fetch('http://localhost:3000/api/chat/inbox', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setInbox(data);
        } catch (err) {
            console.error('Inbox fetch error:', err);
        }
    };

    const fetchMessages = async (otherUserId, silent = false) => {
        const token = localStorage.getItem('token');
        if (!silent) setLoadingMessages(true);
        try {
            const res = await fetch(`http://localhost:3000/api/chat/${otherUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (err) {
            console.error('Messages fetch error:', err);
        } finally {
            if (!silent) setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;
        setSending(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ receiverId: selectedConversation.otherUserId, content: newMessage })
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data]);
                setNewMessage('');
                fetchInbox(token); // refresh inbox
            }
        } catch (err) {
            console.error('Send error:', err);
        } finally {
            setSending(false);
        }
    };

    const openConversation = (msg) => {
        const currentUserId = currentUser?._id || currentUser?.id;
        const isSender = msg.senderId._id === currentUserId || msg.senderId._id?.toString() === currentUserId?.toString();
        const other = isSender ? msg.receiverId : msg.senderId;
        const otherName = other?.name || 'User';
        const prefix = other?.role === 'doctor' ? 'Dr. ' : '';
        setSelectedConversation({ otherUserId: other?._id, otherUserName: `${prefix}${otherName}` });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const currentUserId = currentUser?._id || currentUser?.id;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-lavender-600 w-7 h-7" />
                Messages
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-lavender-100 overflow-hidden" style={{ height: '72vh', display: 'flex' }}>

                {/* --- Inbox Sidebar --- */}
                <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-300"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {inbox.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                                <p className="text-gray-400 text-sm">No conversations yet.</p>
                                <p className="text-gray-300 text-xs mt-1">Book an appointment and start chatting with your doctor!</p>
                            </div>
                        ) : (
                            inbox.map((msg) => {
                                const isSender = msg.senderId._id?.toString() === currentUserId?.toString();
                                const other = isSender ? msg.receiverId : msg.senderId;
                                const prefix = other?.role === 'doctor' ? 'Dr. ' : '';
                                const isSelected = selectedConversation?.otherUserId === other?._id;

                                return (
                                    <button
                                        key={msg._id}
                                        onClick={() => openConversation(msg)}
                                        className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${isSelected ? 'bg-lavender-50' : ''}`}
                                    >
                                        <div className="w-11 h-11 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-700 font-bold text-lg flex-shrink-0">
                                            {other?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-800 text-sm truncate">{prefix}{other?.name}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatDate(msg.createdAt)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{msg.content}</p>
                                        </div>
                                        {!msg.isRead && !isSender && (
                                            <span className="w-2.5 h-2.5 bg-lavender-500 rounded-full flex-shrink-0"></span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* --- Chat Window --- */}
                <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                    {!selectedConversation ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-lavender-50 flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-lavender-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Your Conversations</h3>
                            <p className="text-gray-400 text-sm mt-1">Select a conversation to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-700 font-bold text-lg">
                                    {selectedConversation.otherUserName?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{selectedConversation.otherUserName}</p>
                                    <p className="text-xs text-green-500">Online</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin w-6 h-6 border-2 border-lavender-400 border-t-transparent rounded-full"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                        <User className="w-10 h-10 text-gray-200 mb-2" />
                                        <p>No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = msg.senderId._id?.toString() === currentUserId?.toString() ||
                                                       msg.senderId === currentUserId?.toString();
                                        return (
                                            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                                        ${isMine
                                                            ? 'bg-lavender-600 text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 rounded-bl-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <p className={`text-xs text-gray-400 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-300 border border-gray-200"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="bg-lavender-600 hover:bg-lavender-700 disabled:opacity-50 text-white p-3 rounded-full transition-colors flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
