const express = require('express');
const verifyToken = require('../middleware/authMiddleware.cjs');
const roleMiddleware = require('../middleware/roleMiddleware.cjs');

const router = express.Router();

// Protected Doctor Route
router.get('/dashboard', verifyToken, roleMiddleware('doctor'), (req, res) => {
    res.json({ message: 'Welcome to the Doctor Dashboard', user: req.user });
});

module.exports = router;
