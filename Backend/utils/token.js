const jwt = require('jsonwebtoken');

exports.generateAccessToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
};
