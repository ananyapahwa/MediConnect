import React, { useState } from 'react';
import { MessageSquare, Calendar, User, Activity, Heart, Droplet, ChevronDown, ChevronUp, Bot, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showProjectInfo, setShowProjectInfo] = useState(false);

    const stats = [
        { title: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Glucose', value: '95 mg/dL', icon: Droplet, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Weight', value: '70 kg', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">

            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Good Morning, {user.name || 'User'}</h1>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Link to="/appointments" className="p-4 rounded-xl bg-lavender-50 hover:bg-lavender-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-lavender-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-lavender-700">Book Appointment</span>
                            </Link>
                            <Link to="/doctors" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Find Doctor</span>
                            </Link>
                            <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-green-700">Health Chat</span>
                            </button>
                        </div>
                    </div>

                    {/* Project Info Collapsible */}
                    <div className="border border-lavender-200 rounded-xl overflow-hidden bg-white">
                        <button
                            onClick={() => setShowProjectInfo(!showProjectInfo)}
                            className="w-full flex items-center justify-between p-4 bg-lavender-50 hover:bg-lavender-100 transition-colors text-left"
                        >
                            <span className="font-semibold text-lavender-800">About MediConnect Portal</span>
                            {showProjectInfo ? <ChevronUp className="w-5 h-5 text-lavender-600" /> : <ChevronDown className="w-5 h-5 text-lavender-600" />}
                        </button>

                        {showProjectInfo && (
                            <div className="p-6 space-y-4 text-gray-600 leading-relaxed border-t border-lavender-100 animate-fade-in-up">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Project Title</h3>
                                    <p>MediConnect: Doctor Assistance and Appointment Portal</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Abstract</h3>
                                    <p className="text-justify text-sm">
                                        The MediConnect: Doctor Assistance and Appointment Portal is created to make it easier for patients to connect with doctors without unnecessary delays. The main motivation behind this project is to reduce long waiting times at hospitals and help patients get medical guidance in a quicker and more convenient way. Many people face difficulties in booking appointments or reaching doctors for small doubts and follow-up consultations, which inspired the choice of this project. This portal allows patients to book appointments online based on doctor availability and also chat with doctors in real time for basic consultations and guidance. The project is feasible to implement using commonly available web technologies and real-time communication tools, making it secure, scalable, and easy to use. Overall, the system aims to improve patient experience while making healthcare services more accessible and efficient.
                                    </p>
                                </div>
                            </div>
                        )}
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

                </div>
            </div>

            {/* Floating Chat Button (if closed) */}
            {!isChatOpen && (
                <div className="fixed bottom-8 right-8 z-40">
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                    >
                        <Bot className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Chat Widget */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-lavender-100 overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-lavender-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-semibold">MediBot Assistant</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="hover:bg-lavender-700 p-1 rounded">
                            &times;
                        </button>
                    </div>
                    <div className="h-80 bg-lavender-50 p-4 overflow-y-auto flex flex-col gap-3">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none self-start shadow-sm text-sm text-gray-700 max-w-[80%]">
                            Hello! How can I help you with MediConnect today?
                        </div>
                        <div className="bg-lavender-100 p-3 rounded-2xl rounded-tr-none self-end shadow-sm text-sm text-lavender-900 max-w-[80%]">
                            I need to book an appointment.
                        </div>
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input className="flex-grow bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-lavender-300" placeholder="Type a message..." />
                        <button className="bg-lavender-600 text-white p-2 rounded-full hover:bg-lavender-700">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
