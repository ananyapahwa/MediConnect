const express = require('express');
const verifyToken = require('../middleware/authMiddleware.cjs');

const router = express.Router();

// Protected Route Example
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
