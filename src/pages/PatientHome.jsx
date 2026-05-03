import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Calendar, User, Activity, Heart, Droplet, Bot, Send, X, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PatientHome = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [user, setUser] = useState(null);

    // MediBot AI state
    const [chatMessages, setChatMessages] = useState([
        { role: 'model', content: 'Hi! I\'m MediBot 🩺 — your AI health assistant. Describe your symptoms or ask me a health question, and I\'ll help you understand what type of specialist you might need.' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'patient') {
            navigate('/doctor-home');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const stats = [
        { title: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Glucose', value: '95 mg/dL', icon: Droplet, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Weight', value: '70 kg', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const handleSendToMediBot = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = { role: 'user', content: chatInput.trim() };
        const updatedMessages = [...chatMessages, userMessage];
        setChatMessages(updatedMessages);
        setChatInput('');
        setChatLoading(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ messages: updatedMessages })
            });
            const data = await res.json();
            if (res.ok) {
                setChatMessages(prev => [...prev, { role: 'model', content: data.reply }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'model', content: `⚠️ ${data.message || 'Sorry, I encountered an error. Please try again.'}` }]);
            }
        } catch (err) {
            setChatMessages(prev => [...prev, { role: 'model', content: '⚠️ Could not connect to the AI service. Please check your connection.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    if (!user) return null;

    const formatMessage = (text) => {
        if (!text) return '';
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        return html;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">

            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Good Morning, {user.name}</h1>
                    <p className="text-gray-500 mt-1">Here's your health overview for today.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-lg font-semibold text-lavender-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-lavender-100 flex items-center gap-4 hover:shadow-md transition-all">
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to="/appointments" className="p-4 rounded-xl bg-lavender-50 hover:bg-lavender-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-lavender-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-lavender-700 text-sm">Appointments</span>
                            </Link>
                            <Link to="/doctors" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700 text-sm">Find Doctor</span>
                            </Link>
                            <Link to="/chat" className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-green-700 text-sm">Messages</span>
                            </Link>
                            <Link to="/prescriptions" className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-purple-700 text-sm">Prescriptions</span>
                            </Link>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-blue-50">
                                <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3">1</div>
                                <h3 className="font-semibold text-gray-800 mb-1">Find a Doctor</h3>
                                <p className="text-sm text-gray-500">Browse our verified doctors by specialization and availability.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-lavender-50">
                                <div className="bg-lavender-100 text-lavender-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3">2</div>
                                <h3 className="font-semibold text-gray-800 mb-1">Book Appointment</h3>
                                <p className="text-sm text-gray-500">Choose a convenient time slot and confirm your booking instantly.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-green-50">
                                <div className="bg-green-100 text-green-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3">3</div>
                                <h3 className="font-semibold text-gray-800 mb-1">Get Consultation</h3>
                                <p className="text-sm text-gray-500">Visit your doctor or chat online for quick medical guidance.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">

                    {/* Upcoming Appointment */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-lavender-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 relative z-10">Upcoming Schedule</h2>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-start relative z-10">
                                <div className="bg-lavender-100 text-lavender-700 rounded-lg p-3 text-center min-w-[60px]">
                                    <span className="block text-xs font-bold uppercase">Mar</span>
                                    <span className="block text-xl font-bold">15</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Dr. Emily Chen</h3>
                                    <p className="text-sm text-gray-500">Cardiologist • Consultation</p>
                                    <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">10:00 AM - 11:00 AM</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/appointments" className="block w-full text-center mt-6 text-lavender-600 text-sm font-medium hover:underline">View all appointments</Link>
                    </div>

                    {/* Daily Tip */}
                    <div className="bg-gradient-to-br from-lavender-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Daily Health Tip</h3>
                        <p className="text-lavender-100 text-sm italic">"Stay hydrated! Drinking enough water is crucial for maintaining energy levels and brain function."</p>
                    </div>

                    {/* MediBot AI Teaser */}
                    <div className="bg-gradient-to-br from-green-400 to-teal-500 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-5 h-5" />
                            <h3 className="font-bold text-lg">AI Symptom Checker</h3>
                        </div>
                        <p className="text-green-100 text-sm mb-4">Describe your symptoms and MediBot will recommend the right specialist for you.</p>
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors"
                        >
                            Chat with MediBot
                        </button>
                    </div>

                </div>
            </div>

            {/* Floating MediBot Button (if closed) */}
            {!isChatOpen && (
                <div className="fixed bottom-8 right-8 z-40">
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                    >
                        <Bot className="w-6 h-6" />
                    </button>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                </div>
            )}

            {/* MediBot AI Chat Widget */}
            {isChatOpen && (
                <div className="fixed bottom-8 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col" style={{ height: '520px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 flex items-center justify-between text-white flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold block">MediBot AI</span>
                                <span className="text-xs text-green-100">Powered by Gemini</span>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border-b border-amber-100 px-3 py-2 flex-shrink-0">
                        <p className="text-xs text-amber-700">⚠️ For informational purposes only. Not a substitute for medical advice.</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                                        ${msg.role === 'user'
                                            ? 'bg-green-600 text-white rounded-br-sm'
                                            : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                />
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendToMediBot} className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
                        <input
                            className="flex-grow bg-gray-50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 border border-gray-200"
                            placeholder="Describe your symptoms..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={chatLoading}
                        />
                        <button
                            type="submit"
                            disabled={chatLoading || !chatInput.trim()}
                            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white p-2.5 rounded-full transition-colors flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default PatientHome;
