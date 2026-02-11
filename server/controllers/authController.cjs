const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const validatePassword = (password) => {
    if (password.length < 8 || password.length > 15) {
        return "Password must be at least 8 characters and at most 15 characters.";
    }
    if (!/\d/.test(password)) {
        return "Password must contain at least one digit.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one upper case alphabet.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lower case alphabet.";
    }
    if (!/[!@#$%&*()-+=^]/.test(password)) {
        return "Password must contain at least one special character which includes !@#$%&*()-+=^.";
    }
    if (/\s/.test(password)) {
        return "Password doesn't contain any white space.";
    }
    return null;
};

const register = async (req, res) => {
    const { name, email, password, role } = req.body; // Accept role

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'patient', // Default to patient
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser._id, name, email, role: newUser.role } });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login };
