import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const appointments = [
    { id: 1, doctor: 'Dr. Emily Chen', date: '2024-03-15', time: '10:00 AM', status: 'Upcoming', type: 'Consultation' },
    { id: 2, doctor: 'Dr. Sarah Johnson', date: '2024-02-28', time: '2:30 PM', status: 'Completed', type: 'Follow-up' },
];

const Appointments = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>

            <div className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-white p-6 rounded-xl shadow-sm border border-lavender-100 flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{apt.doctor}</h3>
                            <div className="flex items-center gap-4 text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.date} at {apt.time}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{apt.type}</span>
                            </div>
                        </div>
                        <div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {apt.status === 'Completed' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                {apt.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Appointments;
