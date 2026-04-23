const express = require('express');
require('dotenv').config(); // Load env vars first
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.cjs'); // Import auth routes

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log(MONGO_URI);
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const protectedRoutes = require('./routes/protectedRoutes.cjs');
const doctorRoutes = require('./routes/doctorRoutes.cjs');
const appointmentRoutes = require('./routes/appointmentRoutes.cjs');
const chatRoutes = require('./routes/chatRoutes.cjs');
const prescriptionRoutes = require('./routes/prescriptionRoutes.cjs');
const aiRoutes = require('./routes/aiRoutes.cjs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

