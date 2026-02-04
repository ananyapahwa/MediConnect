import React from 'react';
import { MapPin, Star, Calendar } from 'lucide-react';

const doctors = [
    { id: 1, name: 'Dr. Emily Chen', specialty: 'Cardiologist', rating: 4.9, location: 'New York, NY', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 2, name: 'Dr. James Wilson', specialty: 'Pediatrician', rating: 4.8, location: 'Brooklyn, NY', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 3, name: 'Dr. Sarah Johnson', specialty: 'Dermatologist', rating: 4.9, location: 'Queens, NY', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 4, name: 'Dr. Michael Brown', specialty: 'Neurologist', rating: 4.7, location: 'New York, NY', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300' },
];

const Doctors = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800">Find a Specialist</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white p-6 rounded-xl shadow-sm border border-lavender-100 flex gap-4 hover:shadow-md transition-all">
                        <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-lg object-cover" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                                    <p className="text-lavender-600 font-medium">{doctor.specialty}</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{doctor.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                                <MapPin className="w-4 h-4" />
                                {doctor.location}
                            </div>
                            <button className="mt-4 w-full bg-lavender-100 hover:bg-lavender-200 text-lavender-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctors;
