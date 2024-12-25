import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../Models/User.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret 123',
            {
                expiresIn: '30d',
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
            message: "failed to register",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: 'User is not found'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'user or password is invalid'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret 123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Unable login",
        })
    }
};

export const getUser = async (req, res) => {
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