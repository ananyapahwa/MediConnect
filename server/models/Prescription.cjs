const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g. "500mg"
    frequency: { type: String, required: true }, // e.g. "Twice a day"
    duration: { type: String, required: true }  // e.g. "7 days"
});

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: false
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    medicines: [medicineSchema],
    instructions: {
        type: String,
        default: ''
    },
    followUpDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
