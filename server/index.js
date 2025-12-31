import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import weatherRoutes from './routes/weather.js';
import authRoutes from './routes/auth.js';
import { configureSocket } from './socket/socketHandler.js';
import logger from './utils/logger.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server to allow Socket.IO to attach
const server = http.createServer(app);

// Middlewares (Unit III)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json()); // body-parser
app.use(cookieParser());
app.use(session({
    secret: 'secret_key_weather_app',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // 1 minute session
}));

// Custom Middleware (Unit III) - Request Timer & Logger Integration
app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    next();
});

// Routes (Unit II)
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Weather API (Open-Meteo) is running with Socket.IO & Sessions');
});

// Initialize Socket.IO (Unit III)
const io = configureSocket(server);

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.log(`Server started on port ${PORT}`);
});
