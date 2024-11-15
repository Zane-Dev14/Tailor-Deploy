const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET; // Use a secure secret key for signing tokens

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user; // Attach the user payload to the request object
        next();
    });
};
