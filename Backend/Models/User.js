const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        avatarUrl: String,
        isVerified: {
            type: Boolean,
            default: false // Indicates if the user's email is verified
        },
        verificationCode: {
            type: String // Temporary code sent to user's email
        },
        verificationCodeExpires: {
            type: Date // Expiry time for the verification code
        },
        refreshToken: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);
