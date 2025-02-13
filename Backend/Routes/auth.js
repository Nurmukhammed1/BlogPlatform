const express = require('express');
const Router = express.Router();
const authController = require('../Controllers/authController.js');
const validation = require('../Validations/authValidations.js');
const checkAuth = require('../Middleware/checkAuth.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User.js');

Router.post('/login', validation.loginValidation, authController.login);
Router.post('/register', validation.registerValidation, authController.register);
Router.get('/me', checkAuth, authController.getUser);

Router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await UserModel.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate new access and refresh tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update the stored refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});

module.exports = Router;