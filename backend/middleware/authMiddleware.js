const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden. Invalid token.' });
        }

        req.user = user; // Attach decoded token payload
        next();
    });
};

module.exports = authMiddleware;
