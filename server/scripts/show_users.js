import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

const showUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weatherapp');
        console.log('Connected to MongoDB.');

        const users = await User.find({});
        console.log('\n--- Users ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}`);
            console.log(`Username: ${u.username}`);
            console.log(`Password: ${u.password.substring(0, 20)}... (Hashed)`);
            console.log('---');
        });
        console.log('-------------\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

showUsers();
