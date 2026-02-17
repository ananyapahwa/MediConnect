import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Users, Settings, TrendingUp, Clock, Stethoscope, X, Mail, FileText, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorHome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

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
        fetchData(token);
    }, [navigate]);

    const fetchData = async (token) => {
        try {
            const [appointmentsRes, profileRes] = await Promise.all([
                fetch('http://localhost:3000/api/appointments/doctor', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:3000/api/doctor/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const appointmentsData = await appointmentsRes.json();
            if (appointmentsRes.ok) setAppointments(appointmentsData);

            const profileData = await profileRes.json();
            if (profileRes.ok) setProfile(profileData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter today's appointments
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === todayStr && apt.status !== 'cancelled';
    });

    const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= new Date(todayStr) && apt.status !== 'cancelled';
    });

    const completedAppointments = appointments.filter(apt => apt.status === 'completed');

    // Format time from "HH:mm" to "hh:mm AM/PM"
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };

    // Format date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
    };

    const stats = [
        { title: 'Total Appointments', value: appointments.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Today', value: todayAppointments.length.toString(), icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Upcoming', value: upcomingAppointments.length.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Rating', value: profile?.rating ? profile.rating.toFixed(1) : 'New', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
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
                            <p className="text-xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
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
                            {loading ? (
                                <div className="text-center text-gray-400 py-6">Loading appointments...</div>
                            ) : todayAppointments.length === 0 ? (
                                <div className="text-center py-6">
                                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-400">No appointments scheduled for today.</p>
                                </div>
                            ) : (
                                todayAppointments.map((appointment) => (
                                    <div
                                        key={appointment._id}
                                        onClick={() => setSelectedAppointment(appointment)}
                                        className="flex items-center justify-between p-4 bg-lavender-50 rounded-xl hover:bg-lavender-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg">
                                                <Clock className="w-5 h-5 text-lavender-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {appointment.patientId?.name || 'Unknown Patient'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {appointment.reason || 'Consultation'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700'
                                                    : appointment.status === 'completed' ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                            <span className="text-sm font-medium text-lavender-700 bg-white px-3 py-1 rounded-full">
                                                {formatTime(appointment.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
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
                            {profile ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Profile Completion</span>
                                        <span className="text-sm font-semibold text-lavender-700">
                                            {profile.specialization && profile.phone && profile.address && profile.availability?.length > 0 ? '100%' : '60%'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-lavender-600 h-2 rounded-full" style={{ width: profile.specialization && profile.phone && profile.address && profile.availability?.length > 0 ? '100%' : '60%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {profile.availability?.length > 0 ? 'Your profile is looking great!' : 'Add your availability schedule to attract more patients'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Profile Completion</span>
                                        <span className="text-sm font-semibold text-red-500">0%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                    <p className="text-xs text-red-500">Set up your profile to start receiving appointments</p>
                                </>
                            )}
                        </div>

                        <Link to="/doctor-dashboard" className="block w-full text-center mt-6 bg-lavender-600 text-white py-2 rounded-lg hover:bg-lavender-700 transition-colors text-sm font-medium">
                            {profile ? 'Edit Profile' : 'Complete Profile'}
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

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up" onClick={() => setSelectedAppointment(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-lavender-500 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Appointment Details</h3>
                                    <p className="text-lavender-100 text-sm mt-1">
                                        {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedAppointment(null)} className="text-white/80 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="p-6 space-y-5">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Patient Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-700 font-bold text-lg">
                                            {selectedAppointment.patientId?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{selectedAppointment.patientId?.name || 'Unknown Patient'}</p>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Mail className="w-3 h-3" />
                                                {selectedAppointment.patientId?.email || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Appointment Info</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">
                                            {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">{formatTime(selectedAppointment.time)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">{selectedAppointment.reason || 'No reason provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-700'
                                                : selectedAppointment.status === 'completed' ? 'bg-blue-100 text-blue-700'
                                                    : selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {selectedAppointment.status?.charAt(0).toUpperCase() + selectedAppointment.status?.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="w-full py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700 transition-colors text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorHome;
