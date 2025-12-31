import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

const createSecureUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weatherapp');
        console.log('Connected to MongoDB.');

        const email = 'secure@example.com';
        const rawPassword = 'password123';

        // Check if exists
        const exists = await User.findOne({ email });
        if (exists) {
            console.log('User already exists, deleting old one...');
            await User.deleteOne({ email });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const newUser = await User.create({
            username: 'secure_user_test',
            email,
            password: hashedPassword,
            fullName: 'Secure Tester',
            city: 'Berlin'
        });

        console.log(`Created user: ${newUser.email}`);
        console.log(`Real Password: ${rawPassword}`);
        console.log(`Stored Hash: ${newUser.password}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createSecureUser();
