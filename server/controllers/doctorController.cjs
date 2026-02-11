const Doctor = require('../models/Doctor.cjs');
const User = require('../models/User.cjs');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { specialization, experience, fees, phone, address, availability } = req.body;

        let doctor = await Doctor.findOne({ userId });

        if (doctor) {
            // Update existing profile
            doctor.specialization = specialization;
            doctor.experience = experience;
            doctor.fees = fees;
            doctor.phone = phone;
            doctor.address = address;
            doctor.availability = availability;
            await doctor.save();
        } else {
            // Create new profile
            doctor = new Doctor({
                userId,
                specialization,
                experience,
                fees,
                phone,
                address,
                availability
            });
            await doctor.save();
        }

        res.status(200).json({ message: 'Profile updated successfully', doctor });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.userId }).populate('userId', 'name email');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
