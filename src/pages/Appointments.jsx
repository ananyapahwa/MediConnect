import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

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
            <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>

            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments scheduled.</p>
                ) : (
                    appointments.map((apt) => (
                        <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-lavender-100 flex items-center justify-between hover:shadow-md transition-all">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Dr. {apt.doctorId.userId.name}</h3>
                                <div className="flex items-center gap-4 text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{apt.reason || 'Consultation'}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                        apt.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    {apt.status === 'completed' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                    {apt.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;
