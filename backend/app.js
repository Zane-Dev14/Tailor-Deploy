require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const employeeRouter = require('./routes/employees');
const orderRouter = require('./routes/orders');
const customerRouter = require('./routes/customers');
const authRouter = require('./routes/login');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
connectDB();
const corsOptions = {
    origin: [
        'http://localhost:3001', // Localhost for local development
        'https://tailor-deploy.onrender.com', // Deployed frontend URL
        '*', // Allows all origins (for testing, but avoid in production)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allows cookies and credentials to be sent
};


app.use(cors(corsOptions));
app.use(express.json());

// Session management
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,          
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Public routes
app.use('/api/login', authRouter);

// Protected routes
app.use('/api/employees', authMiddleware, employeeRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/customers', authMiddleware, customerRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
