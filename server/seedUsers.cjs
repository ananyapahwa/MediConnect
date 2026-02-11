const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.cjs');
const Doctor = require('./models/Doctor.cjs');
require('dotenv').config();

const users = [
    { name: 'Dr. Emily Chen', email: 'doctor@mediconnect.com', password: 'password123', role: 'doctor', specialization: 'Cardiologist', fees: 150, experience: 10 },
    { name: 'Dr. James Wilson', email: 'james@mediconnect.com', password: 'password123', role: 'doctor', specialization: 'Pediatrician', fees: 120, experience: 8 },
    { name: 'Dr. Sarah Johnson', email: 'sarah@mediconnect.com', password: 'password123', role: 'doctor', specialization: 'Dermatologist', fees: 180, experience: 12 },
    { name: 'Dr. Michael Brown', email: 'michael@mediconnect.com', password: 'password123', role: 'doctor', specialization: 'Neurologist', fees: 200, experience: 15 },
    { name: 'Alex Johnson', email: 'patient@mediconnect.com', password: 'password123', role: 'patient' },
    { name: 'Maria Garcia', email: 'maria@mediconnect.com', password: 'password123', role: 'patient' },
    { name: 'John Smith', email: 'john@mediconnect.com', password: 'password123', role: 'patient' }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const u of users) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                user = new User({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    role: u.role
                });
                await user.save();
                console.log(`User created: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }

            if (u.role === 'doctor') {
                const doctorProfile = await Doctor.findOne({ userId: user._id });
                if (!doctorProfile) {
                    await new Doctor({
                        userId: user._id,
                        specialization: u.specialization,
                        experience: u.experience,
                        fees: u.fees,
                        phone: '555-0123',
                        address: '123 Medical Center Dr',
                        availability: [
                            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
                            { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
                            { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
                            { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
                            { day: 'Friday', startTime: '09:00', endTime: '13:00' }
                        ]
                    }).save();
                    console.log(`Doctor profile created for ${u.name}`);
                }
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedUsers();
