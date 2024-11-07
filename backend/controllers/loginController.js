const User = require('../models/User');

exports.login = async (req, res) => {
    const { authId, password } = req.body;

    try {
        const user = await User.findOne({ authId });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Directly compare plaintext passwords
        if (user.password !== password) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Generate a token or session here if needed
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};

