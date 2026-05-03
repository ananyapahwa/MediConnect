const Prescription = require('../models/Prescription.cjs');
const Doctor = require('../models/Doctor.cjs');
const User = require('../models/User.cjs');

// Doctor creates a prescription for a patient
const createPrescription = async (req, res) => {
    const doctorUserId = req.user.id;

    try {
        // Find the doctor profile linked to this user
        const doctor = await Doctor.findOne({ userId: doctorUserId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const { appointmentId, patientEmail, diagnosis, medicines, instructions, followUpDate } = req.body;

        if (!patientEmail || !diagnosis || !medicines || medicines.length === 0) {
            return res.status(400).json({ message: 'patientEmail, diagnosis, and at least one medicine are required.' });
        }

        // Look up the patient by email
        const patient = await User.findOne({ email: patientEmail, role: 'patient' });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with that email address.' });
        }

        const Appointment = require('../models/Appointment.cjs');
        const recentAppointment = await Appointment.findOne({
            doctorId: doctor._id,
            patientId: patient._id
        }).sort({ date: -1 });

        const prescriptionData = {
            doctorId: doctor._id,
            patientId: patient._id,
            diagnosis,
            medicines,
            instructions: instructions || '',
            followUpDate: followUpDate || null
        };

        if (appointmentId) {
            prescriptionData.appointmentId = appointmentId;
        } else if (recentAppointment) {
            prescriptionData.appointmentId = recentAppointment._id;
        }

        const prescription = new Prescription(prescriptionData);

        await prescription.save();
        await prescription.populate([
            { path: 'doctorId', populate: { path: 'userId', select: 'name' } },
            { path: 'patientId', select: 'name email' }
        ]);

        res.status(201).json(prescription);
    } catch (error) {
        console.error('createPrescription error:', error);
        res.status(500).json({ message: 'Failed to create prescription.' });
    }
};

// Patient views their own prescriptions
const getPatientPrescriptions = async (req, res) => {
    const patientId = req.user.id;

    try {
        const prescriptions = await Prescription.find({ patientId })
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('appointmentId', 'date time reason')
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error('getPatientPrescriptions error:', error);
        res.status(500).json({ message: 'Failed to fetch prescriptions.' });
    }
};

// Doctor views all prescriptions they have written
const getDoctorPrescriptions = async (req, res) => {
    const doctorUserId = req.user.id;

    try {
        const doctor = await Doctor.findOne({ userId: doctorUserId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const prescriptions = await Prescription.find({ doctorId: doctor._id })
            .populate('patientId', 'name email')
            .populate('appointmentId', 'date time reason')
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error('getDoctorPrescriptions error:', error);
        res.status(500).json({ message: 'Failed to fetch prescriptions.' });
    }
};

module.exports = { createPrescription, getPatientPrescriptions, getDoctorPrescriptions };
