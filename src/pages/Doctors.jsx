import React, { useEffect, useState } from 'react';
import { MapPin, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import Popup from '../components/Popup';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(6); // Show 6 doctors per page
    const [popup, setPopup] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        onClose: () => { }
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/doctor/all');
            const data = await res.json();
            if (res.ok) {
                setDoctors(data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (appointmentData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setPopup({
                isOpen: true,
                title: 'Login Required',
                message: 'Please login to book an appointment',
                type: 'error',
                onClose: () => setPopup(prev => ({ ...prev, isOpen: false }))
            });
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Booking failed');
            }

            setPopup({
                isOpen: true,
                title: 'Success',
                message: 'Appointment booked successfully!',
                type: 'success',
                onClose: () => setPopup(prev => ({ ...prev, isOpen: false }))
            });
        } catch (error) {
            setPopup({
                isOpen: true,
                title: 'Booking Failed',
                message: error.message,
                type: 'error',
                onClose: () => setPopup(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    // Pagination logic
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(doctors.length / doctorsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="text-center p-8">Loading doctors...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Popup
                isOpen={popup.isOpen}
                onClose={popup.onClose}
                title={popup.title}
                message={popup.message}
                type={popup.type}
            />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Find a Specialist</h2>
                <p className="text-sm text-gray-600">
                    Showing {indexOfFirstDoctor + 1}-{Math.min(indexOfLastDoctor, doctors.length)} of {doctors.length} doctors
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {currentDoctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-sm border border-lavender-100 flex gap-4 hover:shadow-md transition-all">
                        {/* Placeholder image or doctor's uploaded image if we had one */}
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-2xl">
                            {doctor.userId.name.charAt(0)}
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{doctor.userId.name}</h3>
                                    <p className="text-lavender-600 font-medium">{doctor.specialization}</p>
                                    <p className="text-xs text-gray-500">{doctor.experience} years exp.</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{doctor.rating || 'New'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                                <MapPin className="w-4 h-4" />
                                {doctor.address}
                            </div>
                            <div className="mt-2 text-sm font-medium text-gray-700">Fees: ${doctor.fees}</div>
                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                className="mt-3 w-full bg-lavender-100 hover:bg-lavender-200 text-lavender-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all ${currentPage === 1
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-lavender-200 text-lavender-600 hover:bg-lavender-50'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Show first page, last page, current page, and pages around current
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => paginate(pageNumber)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${currentPage === pageNumber
                                                ? 'bg-lavender-600 text-white border-lavender-600'
                                                : 'border-lavender-200 text-lavender-600 hover:bg-lavender-50'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all ${currentPage === totalPages
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-lavender-200 text-lavender-600 hover:bg-lavender-50'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onBook={handleBookAppointment}
                />
            )}
        </div>
    );
};

export default Doctors;
