module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // User is authenticated
    } else {
        res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};
