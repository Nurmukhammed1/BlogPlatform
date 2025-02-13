const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

const nodemailer = require('nodemailer');

const UserModel = require('../Models/User.js');

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Send verification code to email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: 'Your Verification Code',
                text: `Your verification code is: ${verificationCode}`,
            });
            console.log('Email sent successfully!');
        } catch (error) {
            console.error('Email sending error:', error); // Detailed error log
        }

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
            verificationCode, // Store the code temporarily
            isVerified: false, // User is not verified yet
        });

        const user = await doc.save();

        res.json({
            message: 'Verification code sent to your email',
            userId: user._id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { userId, code } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined; // Clear the code
        await user.save();

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE,
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                message: 'User is not found'
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to get user",
        });
    }
};