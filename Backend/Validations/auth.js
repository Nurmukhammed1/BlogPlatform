import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must has at least 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Enter your name').isLength({ min: 5 }),
    body('avatarUrl', 'Invalid Avatar URL').optional().isURL(),
];

