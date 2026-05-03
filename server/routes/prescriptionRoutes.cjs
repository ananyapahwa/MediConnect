const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.cjs');
const roleMiddleware = require('../middleware/roleMiddleware.cjs');
const { createPrescription, getPatientPrescriptions, getDoctorPrescriptions } = require('../controllers/prescriptionController.cjs');

// Patient: view their prescriptions
router.get('/my', verifyToken, roleMiddleware('patient'), getPatientPrescriptions);

// Doctor: view prescriptions they've written
router.get('/doctor', verifyToken, roleMiddleware('doctor'), getDoctorPrescriptions);

// Doctor: create a new prescription
router.post('/', verifyToken, roleMiddleware('doctor'), createPrescription);

module.exports = router;
