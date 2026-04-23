import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar, Settings, LogOut, Save, Clock, CheckCircle, XCircle, X, Mail, FileText, AlertCircle, MessageSquare, Send, Pill, Plus, Trash2 } from 'lucide-react';
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

    // Chat state
    const [inbox, setInbox] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null); // { otherUserId, otherUserName }
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const chatEndRef = useRef(null);
    const chatPollRef = useRef(null);

    // Prescriptions state
    const [doctorPrescriptions, setDoctorPrescriptions] = useState([]);
    const [rxForm, setRxForm] = useState({
        patientEmail: '', diagnosis: '', instructions: '', followUpDate: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
    });
    const [rxLoading, setRxLoading] = useState(false);
    const [rxMessage, setRxMessage] = useState('');

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
        fetchInbox(token);
        fetchDoctorPrescriptions(token);
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

    const fetchInbox = async (token) => {
        try {
            const res = await fetch('http://localhost:3000/api/chat/inbox', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setInbox(data);
        } catch (err) { console.error('inbox err', err); }
    };

    const fetchChatMessages = async (otherUserId, silent = false) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/chat/${otherUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setChatMessages(data);
        } catch (err) { console.error('chat fetch err', err); }
    };

    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !selectedChat) return;
        setChatSending(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ receiverId: selectedChat.otherUserId, content: chatInput })
            });
            const data = await res.json();
            if (res.ok) { setChatMessages(prev => [...prev, data]); setChatInput(''); fetchInbox(token); }
        } catch (err) { console.error('send chat err', err); }
        finally { setChatSending(false); }
    };

    const openDoctorChat = (msg) => {
        const doctorUserId = user?._id || user?.id;
        const isSender = msg.senderId._id?.toString() === doctorUserId?.toString();
        const other = isSender ? msg.receiverId : msg.senderId;
        setSelectedChat({ otherUserId: other?._id, otherUserName: other?.name });
        fetchChatMessages(other?._id);
    };

    const fetchDoctorPrescriptions = async (token) => {
        try {
            const res = await fetch('http://localhost:3000/api/prescriptions/doctor', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setDoctorPrescriptions(data);
        } catch (err) { console.error('prescriptions err', err); }
    };

    const handleCreatePrescription = async (e) => {
        e.preventDefault();
        setRxLoading(true); setRxMessage('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/prescriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(rxForm)
            });
            const data = await res.json();
            if (res.ok) {
                setRxMessage('Prescription created successfully!');
                setRxForm({ patientEmail: '', diagnosis: '', instructions: '', followUpDate: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }] });
                fetchDoctorPrescriptions(token);
            } else { setRxMessage(data.message || 'Failed to create prescription.'); }
        } catch (err) { setRxMessage('Error creating prescription.'); }
        finally { setRxLoading(false); }
    };

    const addMedicine = () => setRxForm(f => ({ ...f, medicines: [...f.medicines, { name: '', dosage: '', frequency: '', duration: '' }] }));
    const removeMedicine = (i) => setRxForm(f => ({ ...f, medicines: f.medicines.filter((_, idx) => idx !== i) }));
    const updateMedicine = (i, field, value) => { const meds = [...rxForm.medicines]; meds[i][field] = value; setRxForm(f => ({ ...f, medicines: meds })); };

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
                    <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-lavender-50 text-lavender-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">Patient Messages</span>
                        {inbox.filter(m => !m.isRead && m.receiverId?._id?.toString() === (user?._id || user?.id)?.toString()).length > 0 && (
                            <span className="ml-auto bg-lavender-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {inbox.filter(m => !m.isRead).length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setActiveTab('prescriptions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'prescriptions' ? 'bg-lavender-50 text-lavender-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Pill className="h-5 w-5" />
                        <span className="font-medium">Prescriptions</span>
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

                {/* ===== CHAT TAB ===== */}
                {activeTab === 'chat' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex" style={{ height: '70vh' }}>
                        {/* Inbox */}
                        <div className={`w-72 border-r border-gray-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-700">Patient Inbox</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {inbox.length === 0 ? (
                                    <div className="p-6 text-center text-gray-400 text-sm">No messages yet.</div>
                                ) : inbox.map((msg) => {
                                    const doctorUserId = user?._id || user?.id;
                                    const isSender = msg.senderId._id?.toString() === doctorUserId?.toString();
                                    const other = isSender ? msg.receiverId : msg.senderId;
                                    return (
                                        <button key={msg._id} onClick={() => openDoctorChat(msg)}
                                            className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${selectedChat?.otherUserId === other?._id ? 'bg-lavender-50' : ''}`}>
                                            <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-700 font-bold">
                                                {other?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-800 truncate">{other?.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{msg.content}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Chat Window */}
                        <div className="flex-1 flex flex-col">
                            {!selectedChat ? (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Select a conversation</div>
                            ) : (
                                <>
                                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-lavender-100 flex items-center justify-center text-lavender-700 font-bold">
                                            {selectedChat.otherUserName?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <p className="font-semibold text-gray-800">{selectedChat.otherUserName}</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                        {chatMessages.map((msg) => {
                                            const doctorUserId = user?._id || user?.id;
                                            const isMine = msg.senderId._id?.toString() === doctorUserId?.toString() || msg.senderId === doctorUserId?.toString();
                                            return (
                                                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-lavender-600 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                                        <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                                            placeholder="Type a message..." disabled={chatSending}
                                            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-300 border border-gray-200" />
                                        <button type="submit" disabled={chatSending || !chatInput.trim()}
                                            className="bg-lavender-600 hover:bg-lavender-700 disabled:opacity-50 text-white p-2.5 rounded-full transition-colors">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== PRESCRIPTIONS TAB ===== */}
                {activeTab === 'prescriptions' && (
                    <div className="space-y-6">
                        {/* Write New Prescription */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Pill className="w-5 h-5 text-purple-500" /> Write New Prescription</h2>
                            {rxMessage && <div className={`p-3 mb-4 rounded-lg text-sm ${rxMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{rxMessage}</div>}
                            <form onSubmit={handleCreatePrescription} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
                                        <input type="email" value={rxForm.patientEmail} onChange={e => setRxForm(f => ({...f, patientEmail: e.target.value}))}
                                            placeholder="patient@example.com" required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400" />
                                        <p className="text-xs text-gray-400 mt-1">Find this from the appointment details modal.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                        <input type="text" value={rxForm.diagnosis} onChange={e => setRxForm(f => ({...f, diagnosis: e.target.value}))}
                                            placeholder="e.g. Upper respiratory infection" required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Medicines</label>
                                        <button type="button" onClick={addMedicine} className="text-lavender-600 text-sm flex items-center gap-1 hover:text-lavender-800">
                                            <Plus className="w-4 h-4" /> Add Medicine
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {rxForm.medicines.map((med, i) => (
                                            <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl items-end">
                                                <div><label className="text-xs text-gray-500">Name</label>
                                                    <input value={med.name} onChange={e => updateMedicine(i, 'name', e.target.value)} placeholder="e.g. Amoxicillin" required className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" /></div>
                                                <div><label className="text-xs text-gray-500">Dosage</label>
                                                    <input value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" required className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" /></div>
                                                <div><label className="text-xs text-gray-500">Frequency</label>
                                                    <input value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} placeholder="e.g. Twice a day" required className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" /></div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1"><label className="text-xs text-gray-500">Duration</label>
                                                        <input value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} placeholder="e.g. 7 days" required className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" /></div>
                                                    {rxForm.medicines.length > 1 && <button type="button" onClick={() => removeMedicine(i)} className="text-red-400 hover:text-red-600 mt-4"><Trash2 className="w-4 h-4" /></button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (optional)</label>
                                        <textarea value={rxForm.instructions} onChange={e => setRxForm(f => ({...f, instructions: e.target.value}))}
                                            placeholder="e.g. Take after meals. Avoid alcohol." rows={2}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date (optional)</label>
                                        <input type="date" value={rxForm.followUpDate} onChange={e => setRxForm(f => ({...f, followUpDate: e.target.value}))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={rxLoading} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2">
                                        {rxLoading ? 'Creating...' : <><FileText className="w-4 h-4" /> Create Prescription</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Past Prescriptions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Prescriptions Issued</h2>
                            {doctorPrescriptions.length === 0 ? (
                                <p className="text-gray-400 text-sm">No prescriptions issued yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {doctorPrescriptions.map(rx => (
                                        <div key={rx._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{rx.patientId?.name || 'Patient'}</p>
                                                <p className="text-xs text-gray-500">{rx.diagnosis}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{new Date(rx.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">{rx.medicines.length} medicine{rx.medicines.length > 1 ? 's' : ''}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                            <div className="flex flex-col gap-0.5">
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
