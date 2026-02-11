const express = require('express');
const { bookAppointment, getDoctorAppointments, getPatientAppointments } = require('../controllers/appointmentController.cjs');
const verifyToken = require('../middleware/authMiddleware.cjs');
const roleMiddleware = require('../middleware/roleMiddleware.cjs');

const router = express.Router();

router.post('/book', verifyToken, roleMiddleware('patient'), bookAppointment);
router.get('/doctor', verifyToken, roleMiddleware('doctor'), getDoctorAppointments);
router.get('/patient', verifyToken, roleMiddleware('patient'), getPatientAppointments);

module.exports = router;
