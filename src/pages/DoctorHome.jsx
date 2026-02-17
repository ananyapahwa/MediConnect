import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Users, Settings, TrendingUp, Clock, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorHome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'doctor') {
            navigate('/patient-home');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const stats = [
        { title: 'Total Patients', value: '156', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Appointments Today', value: '8', icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Pending Reviews', value: '12', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Rating', value: '4.8', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const todayAppointments = [
        { time: '09:00 AM', patient: 'John Doe', type: 'Consultation' },
        { time: '10:30 AM', patient: 'Sarah Smith', type: 'Follow-up' },
        { time: '02:00 PM', patient: 'Michael Brown', type: 'Check-up' },
    ];

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">

            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, Dr. {user.name}</h1>
                    <p className="text-gray-500 mt-1">Here's your practice overview for today.</p>
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
                            <Link to="/doctor-dashboard" className="p-4 rounded-xl bg-lavender-50 hover:bg-lavender-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Activity className="w-6 h-6 text-lavender-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-lavender-700">My Dashboard</span>
                            </Link>
                            <Link to="/doctor-dashboard" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Appointments</span>
                            </Link>
                            <Link to="/doctor-dashboard" className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2 group text-center cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Settings className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-green-700">Profile Settings</span>
                            </Link>
                        </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
                        <div className="space-y-3">
                            {todayAppointments.map((appointment, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-lavender-50 rounded-xl hover:bg-lavender-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-lg">
                                            <Clock className="w-5 h-5 text-lavender-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{appointment.patient}</p>
                                            <p className="text-sm text-gray-500">{appointment.type}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-lavender-700 bg-white px-3 py-1 rounded-full">
                                        {appointment.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Link to="/doctor-dashboard" className="block w-full text-center mt-4 text-lavender-600 text-sm font-medium hover:underline">
                            View all appointments
                        </Link>
                    </div>

                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">

                    {/* Profile Completion */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-lavender-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 relative z-10">Profile Status</h2>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Profile Completion</span>
                                <span className="text-sm font-semibold text-lavender-700">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-lavender-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500">Complete your profile to attract more patients</p>
                        </div>

                        <Link to="/doctor-dashboard" className="block w-full text-center mt-6 bg-lavender-600 text-white py-2 rounded-lg hover:bg-lavender-700 transition-colors text-sm font-medium">
                            Complete Profile
                        </Link>
                    </div>

                    {/* Quick Tip */}
                    <div className="bg-gradient-to-br from-lavender-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Stethoscope className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Doctor's Tip</h3>
                        </div>
                        <p className="text-lavender-100 text-sm italic">"Keep your availability schedule updated to help patients book appointments more easily."</p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default DoctorHome;
