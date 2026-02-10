import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar, Settings, LogOut } from 'lucide-react';

const DoctorDashboard = () => {
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
            navigate('/'); // Redirect non-doctors to home
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-lavender-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-5 w-5 text-lavender-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">MediConnect</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">Doctor Portal</p>
                </div>
                <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-lavender-50 text-lavender-700 rounded-xl">
                        <Activity className="h-5 w-5" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">Patients</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Appointments</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                    </a>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {user.name}</h1>
                        <p className="text-gray-600">Here's what's happening today.</p>
                    </div>
                    <div className="h-10 w-10 bg-lavender-200 rounded-full flex items-center justify-center text-lavender-700 font-bold border-2 border-white shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
                        <p className="text-sm text-gray-500">Total Patients</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-lavender-50 rounded-xl">
                                <Calendar className="h-6 w-6 text-lavender-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">+5%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">42</h3>
                        <p className="text-sm text-gray-500">Appointments Today</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Activity className="h-6 w-6 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">Normal</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">98%</h3>
                        <p className="text-sm text-gray-500">Patient Satisfaction</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">More dashboard features coming soon...</p>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
