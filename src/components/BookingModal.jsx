import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import CalendarGrid from './CalendarGrid';

const BookingModal = ({ doctor, onClose, onBook }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock booked slots for now, or fetch them if needed
    // In a real app, you would fetch booked slots for the selected month/week
    // For this demo, we can assume no previous bookings or fetch them
    const [bookedSlots] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!selectedSlot) {
            setError('Please select a time slot');
            setLoading(false);
            return;
        }

        try {
            // We need to construct the full date object here based on what CalendarGrid returns
            // But CalendarGrid currently handles date state internally. 
            // Let's refactor CalendarGrid slightly to lift state up or pass exact date back.
            // For now, let's assume CalendarGrid passes back a full ISO string or similar.
            // Actually, looking at CalendarGrid, it passes 'time' string. 
            // We need the date. 
            // Let's update CalendarGrid to pass { date, time } or we need to lift state.

            // Wait, I need to refactor CalendarGrid to be more controlled or pass back date.
            // Let's stick to the plan: update BookingModal, but I might need to tweak CalendarGrid.
            // Let's assuming I update CalendarGrid in the next step to pass full date context.

            // Actually, let's implement a listener in BookingModal that CalendarGrid calls including Date.
            // See updated CalendarGrid usage below.

            // Re-reading CalendarGrid: onSlotSelect(slot.time) is called.
            // I need the date. 
            // Let's proceed with this replacement, and I will strictly update CalendarGrid next to pass the date too.

            await onBook({
                doctorId: doctor._id,
                date: selectedSlot.date, // Expecting date object
                time: selectedSlot.time,
                reason
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative animate-fade-in-up flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h2>
                <p className="text-sm text-gray-500 mb-6">with Dr. {doctor.userId.name}</p>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

                <div className="flex-grow overflow-y-auto">
                    <CalendarGrid
                        availability={doctor.availability}
                        bookedSlots={bookedSlots}
                        onSlotSelect={(slotInfo) => setSelectedSlot(slotInfo)}
                    />
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-500"
                            rows="2"
                            placeholder="Briefly describe your symptoms..."
                        ></textarea>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedSlot}
                        className="w-full bg-lavender-600 hover:bg-lavender-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Booking...' : selectedSlot ? `Confirm Booking for ${selectedSlot.time}` : 'Select a Slot to Book'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
