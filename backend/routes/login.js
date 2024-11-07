const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as needed
// loginController.js
router.post('/', async (req, res) => {
    const { authId, password } = req.body;

    try {
        const user = await User.findOne({ authId });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Send a response with a success message (no session needed)
        res.json({ message: 'Login successful', user: { authId: user.authId, id: user._id } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

module.exports = router;
