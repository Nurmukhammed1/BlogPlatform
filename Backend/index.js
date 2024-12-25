import express from 'express';
import mongoose from 'mongoose';

import checkAuth from './utils/checkAuth.js'

import { registerValidation } from './Validations/auth.js';

import * as userController from './Controllers/userController.js';

mongoose
    .connect('mongodb+srv://admin:12345@cluster0.r7c35.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', userController.login);

app.post('/auth/register', registerValidation, userController.register);

app.get('/auth/me', checkAuth, userController.getUser);

app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});