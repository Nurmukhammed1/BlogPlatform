const body = require('express-validator').body;

exports.registerValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must has at least 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Enter your name').isLength({ min: 5 }),
    body('avatarUrl', 'Invalid Avatar URL').optional().isURL(),
];

exports.loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must has at least 5 symbols').isLength({ min: 5 }),
];

