import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar, Settings, LogOut, Save, Clock, CheckCircle, XCircle, X, Mail, FileText, AlertCircle } from 'lucide-react';
import CalendarGrid from '../components/CalendarGrid';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState({
        specialization: '',
        experience: 0,
        fees: 0,
        phone: '',
        address: '',
        availability: []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'doctor') {
            navigate('/');
            return;
        }

        setUser(parsedUser);
        fetchAppointments(token);
        fetchProfile(token);
    }, [navigate]);

    const fetchAppointments = async (token) => {
        try {
            const res = await fetch('http://localhost:3000/api/appointments/doctor', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchProfile = async (token) => {
        try {
            const res = await fetch('http://localhost:3000/api/doctor/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data) {
                setProfile({
                    specialization: data.specialization || '',
                    experience: data.experience || 0,
                    fees: data.fees || 0,
                    phone: data.phone || '',
                    address: data.address || '',
                    availability: data.availability || []
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/doctor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityChange = (index, field, value) => {
        const newAvailability = [...profile.availability];
        newAvailability[index][field] = value;
        setProfile({ ...profile, availability: newAvailability });
    };

    const addAvailabilitySlot = () => {
        setProfile({
            ...profile,
            availability: [...profile.availability, { day: 'Monday', startTime: '09:00', endTime: '17:00' }]
        });
    };

    const removeAvailabilitySlot = (index) => {
        const newAvailability = profile.availability.filter((_, i) => i !== index);
        setProfile({ ...profile, availability: newAvailability });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:block fixed h-full z-10">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-lavender-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-5 w-5 text-lavender-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">MediConnect</span>
                    </div>
                </div>
                <nav className="p-4 space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-lavender-50 text-lavender-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Activity className="h-5 w-5" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'appointments' ? 'bg-lavender-50 text-lavender-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Appointments</span>
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-lavender-50 text-lavender-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings & Schedule</span>
                    </button>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 ml-64">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {user.name}</h1>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900">{appointments.length}</h3>
                            <p className="text-sm text-gray-500">Total Appointments</p>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Appointment Calendar</h2>
                            <div className="flex gap-2">
                                <span className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 bg-lavender-600 rounded-full mr-1"></span> Selected</span>
                                <span className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded-full mr-1"></span> Booked</span>
                            </div>
                        </div>
                        <div className="p-6">
                            {/* We need to pass the full list of appointments to the calendar to show 'Busy' slots */}
                            {/* Ideally, CalendarGrid should take 'appointments' array and parse it */}
                            {/* For now, we will map appointments to 'bookedSlots' format expected by CalendarGrid */}
                            <CalendarGrid
                                availability={profile.availability}
                                bookedSlots={appointments}
                                onSlotSelect={(slot) => {
                                    if (slot.booking) {
                                        setSelectedAppointment(slot.booking);
                                    }
                                }}
                                isDoctorView={true}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile & Schedule Settings</h2>
                        {message && <div className={`p-4 mb-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                    <input type="text" value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                    <input type="number" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Number(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees ($)</label>
                                    <input type="number" value={profile.fees} onChange={(e) => setProfile({ ...profile, fees: Number(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                                    <textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500" rows="3" required></textarea>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Schedule</h3>
                                <div className="space-y-4">
                                    {profile.availability.map((slot, index) => (
                                        <div key={index} className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                            <select value={slot.day} onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)} className="px-4 py-2 rounded-lg border border-gray-200">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                            <div className="flex items-center gap-2">
                                                <input type="time" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)} className="px-4 py-2 rounded-lg border border-gray-200" required />
                                                <span>to</span>
                                                <input type="time" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)} className="px-4 py-2 rounded-lg border border-gray-200" required />
                                            </div>
                                            <button type="button" onClick={() => removeAvailabilitySlot(index)} className="text-red-500 hover:text-red-700">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addAvailabilitySlot} className="flex items-center gap-2 text-lavender-600 font-medium hover:text-lavender-700">
                                        <Clock className="w-4 h-4" /> Add Slot
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-lavender-600 text-white rounded-xl hover:bg-lavender-700 transition-colors flex items-center gap-2">
                                    {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Appointment Detail Modal */}
                {selectedAppointment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAppointment(null)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-gradient-to-r from-lavender-500 to-purple-600 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">Appointment Details</h3>
                                        <p className="text-lavender-100 text-sm mt-1">
                                            {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                                            {(() => { const [h, m] = selectedAppointment.time.split(':'); const hr = parseInt(h); return `${(hr % 12 || 12).toString().padStart(2, '0')}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; })()}
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedAppointment(null)} className="text-white/80 hover:text-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Patient Information</h4>
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
                                            <span className="text-sm text-gray-700">
                                                {(() => { const [h, m] = selectedAppointment.time.split(':'); const hr = parseInt(h); return `${(hr % 12 || 12).toString().padStart(2, '0')}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; })()}
                                            </span>
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
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <button onClick={() => setSelectedAppointment(null)} className="w-full py-2 bg-lavender-600 text-white rounded-lg hover:bg-lavender-700 transition-colors text-sm font-medium">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
