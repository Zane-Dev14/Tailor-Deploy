require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const employeeRouter = require('./routes/employees');
const orderRouter = require('./routes/orders');
const customerRouter = require('./routes/customers');
const authRouter = require('./routes/login');
const authMiddleware = require('./middleware/authMiddleware'); // Updated for JWT

const app = express();
connectDB();

const corsOptions = {
    origin: [
        'http://localhost:3001',
        'https://tailor-deploy.onrender.com',
        '*', // Avoid this in production
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Public routes
app.use('/api/login', authRouter);

// Middleware for JWT-based authentication
app.use(authMiddleware);

// Protected routes
app.use('/api/employees', employeeRouter);
app.use('/api/orders', orderRouter);
app.use('/api/customers', customerRouter);

// Test route for checking JWT authentication status
app.get('/api/auth/status', (req, res) => {
    if (req.user) {
        return res.status(200).json({ message: 'Authenticated' });
    } else {
        return res.status(401).json({ message: 'Not authenticated' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
