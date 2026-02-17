const express = require('express');
const verifyToken = require('../middleware/authMiddleware.cjs');
const roleMiddleware = require('../middleware/roleMiddleware.cjs');
const { updateProfile, getDoctorProfile, getAllDoctors, getDoctorById } = require('../controllers/doctorController.cjs');

const router = express.Router();

// Public route to get all doctors
router.get('/all', getAllDoctors);

// Protected Doctor Routes (static paths MUST come before /:id)
router.get('/dashboard', verifyToken, roleMiddleware('doctor'), (req, res) => {
    res.json({ message: 'Welcome to the Doctor Dashboard', user: req.user });
});

router.put('/profile', verifyToken, roleMiddleware('doctor'), updateProfile);
router.get('/profile', verifyToken, roleMiddleware('doctor'), getDoctorProfile);

// Dynamic route — must be LAST to avoid catching /all, /dashboard, /profile
router.get('/:id', getDoctorById);

module.exports = router;
