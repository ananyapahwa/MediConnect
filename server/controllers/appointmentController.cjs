const Appointment = require('../models/Appointment.cjs');
const Doctor = require('../models/Doctor.cjs');

exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;
        const patientId = req.user.id;

        // Check availability (Basic check - can be enhanced)
        // Ideally, check if the slot is within doctor's schedule and not already booked
        const existingAppointment = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
        if (existingAppointment) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const appointment = new Appointment({
            patientId,
            doctorId,
            date,
            time,
            reason
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        // Find the doctor profile associated with the current user
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('patientId', 'name email')
            .sort({ date: 1, time: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' }
            })
            .sort({ date: -1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
