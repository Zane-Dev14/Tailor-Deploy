const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust based on your setup
const SECRET_KEY = process.env.JWT_SECRET; // Ensure this matches your .env file

const router = require('express').Router();

router.post('/', async (req, res) => {
    const { authId, password } = req.body;

    try {
        // Find user by authId
        const user = await User.findOne({ authId });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ authId: user.authId, id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        // Respond with token
        res.json({ token, message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    // Logout is managed client-side by clearing the token
    res.json({ message: 'Logout successful. Please clear your token on the client.' });
});

module.exports = router;
