import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.log(`Error: ${error.message}`);
        console.error(`Error: ${error.message}`);
        console.error(`Error: ${error.message}`);
        console.error("Warning: MongoDB connection failed. Auth features will not work, but Weather features should still function.");
        // process.exit(1); // Allow server to run without DB for now
    }
};

export default connectDB;
