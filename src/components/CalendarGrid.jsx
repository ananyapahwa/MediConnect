import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const CalendarGrid = ({ availability = [], bookedSlots = [], onSlotSelect, isDoctorView = false }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="font-bold text-lg text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                    {format(addDays(startDate, i), 'EEE')}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                // Check if doctor is available on this day of week
                const dayOfWeek = format(day, 'EEEE');
                const isAvailableDay = availability.some(slot => slot.day === dayOfWeek);

                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        key={day}
                        className={`
                            h-10 w-10 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all
                            ${!isCurrentMonth ? 'text-gray-300' : isAvailableDay ? 'text-gray-800 hover:bg-lavender-50 font-medium' : 'text-gray-300 pointer-events-none'}
                            ${isSelected ? 'bg-lavender-600 text-white hover:bg-lavender-700' : ''}
                        `}
                        onClick={() => {
                            if (isCurrentMonth && isAvailableDay) {
                                setSelectedDate(cloneDay);
                                onSlotSelect(null); // Reset time slot when date changes
                            }
                        }}
                    >
                        {formattedDate}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day} className="grid grid-cols-7 gap-y-2">
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    const generateTimeSlots = () => {
        if (!selectedDate) return [];

        const dayOfWeek = format(selectedDate, 'EEEE');
        const daySchedule = availability.find(s => s.day === dayOfWeek);

        if (!daySchedule) return [];

        const slots = [];
        let start = parseInt(daySchedule.startTime.split(':')[0]);
        let end = parseInt(daySchedule.endTime.split(':')[0]);

        for (let i = start; i < end; i++) {
            const timeString = `${i.toString().padStart(2, '0')}:00`;
            const isBooked = bookedSlots.some(
                booking => isSameDay(new Date(booking.date), selectedDate) && booking.time === timeString && booking.status !== 'cancelled'
            );

            slots.push({
                time: timeString,
                isBooked: isBooked
            });

            // Add half-hour slot if needed, keeping simple for now
            const halfHourString = `${i.toString().padStart(2, '0')}:30`;
            const isHalfHourBooked = bookedSlots.some(
                booking => isSameDay(new Date(booking.date), selectedDate) && booking.time === halfHourString && booking.status !== 'cancelled'
            );
            slots.push({
                time: halfHourString,
                isBooked: isHalfHourBooked
            });
        }
        return slots;
    };

    const renderTimeSlots = () => {
        const slots = generateTimeSlots();

        if (slots.length === 0) {
            return <div className="text-center text-gray-500 py-4">No slots available for this date.</div>;
        }

        return (
            <div className="grid grid-cols-3 gap-3 mt-4">
                {slots.map((slot, index) => (
                    <button
                        key={index}
                        disabled={slot.isBooked && !isDoctorView}
                        onClick={() => onSlotSelect({ date: selectedDate, time: slot.time })}
                        className={`
                            py-2 px-3 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2
                            ${slot.isBooked
                                ? isDoctorView
                                    ? 'bg-red-50 border-red-200 text-red-700 cursor-default'
                                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-200 hover:border-lavender-500 hover:text-lavender-600 text-gray-700 focus:ring-2 focus:ring-lavender-500 focus:bg-lavender-50'
                            }
                        `}
                    >
                        <Clock className="w-3 h-3" />
                        {slot.time}
                        {slot.isBooked && isDoctorView && <span className="text-xs">(Booked)</span>}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Select Date</h3>
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
                <div className="border-l border-gray-100 pl-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Available Slots for {format(selectedDate, 'MMMM do, yyyy')}
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto">
                        {renderTimeSlots()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;
