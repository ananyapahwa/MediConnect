import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, User, Activity, Heart, Droplet, Bot, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PatientHome = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [user, setUser] = useState(null);

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

    const stats = [
        { title: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Glucose', value: '95 mg/dL', icon: Droplet, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Weight', value: '70 kg', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    if (!user) return null;

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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Link to="/appointments" className="p-4 rounded-xl bg-lavender-50 hover:bg-lavender-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-lavender-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-lavender-700">My Appointments</span>
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

export default PatientHome;
