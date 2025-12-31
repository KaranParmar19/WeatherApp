import express from 'express';
import User from '../models/User.js';

import bcrypt from 'bcryptjs';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, fullName, city } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate random username
        const randomUsername = `user_${Math.random().toString(36).substr(2, 9)}`;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username: randomUsername,
            email,
            password: hashedPassword,
            fullName,
            city: city || 'New York'
        });

        // Do NOT log in automatically. require manual login.
        // req.session.user = {
        //     id: newUser._id,
        //     email: newUser.email,
        //     fullName: newUser.fullName,
        //     city: newUser.city
        // };

        res.status(201).json({ message: "User registered successfully", username: newUser.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Session Login
        req.session.user = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            city: user.city
        };

        res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/auth/me (Check session)
router.get('/me', async (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

export default router;
