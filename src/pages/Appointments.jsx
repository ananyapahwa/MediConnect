import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:3000/api/appointments/patient', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                <div className="flex gap-3">
                    <Link
                        to="/prescriptions"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-sm font-medium transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        My Prescriptions
                    </Link>
                    <Link
                        to="/chat"
                        className="flex items-center gap-2 px-4 py-2 bg-lavender-50 text-lavender-700 hover:bg-lavender-100 rounded-xl text-sm font-medium transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Messages
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments scheduled.</p>
                ) : (
                    appointments.map((apt) => (
                        <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-lavender-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Dr. {apt.doctorId.userId.name}</h3>
                                    <div className="flex items-center gap-4 text-gray-500 mt-1 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                        <span>{apt.reason || 'Consultation'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                            apt.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {apt.status === 'completed' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                        {apt.status}
                                    </span>
                                    {/* Message Doctor button — links to chat with pre-filled doctor */}
                                    <Link
                                        to={`/chat?doctorId=${apt.doctorId.userId._id}&doctorName=${encodeURIComponent(apt.doctorId.userId.name)}`}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-xl text-sm font-medium transition-colors"
                                        title="Message Doctor"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="hidden sm:inline">Message</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;
