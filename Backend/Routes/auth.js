const express = require('express');
const Router = express.Router();
const authController = require('../Controllers/authController.js');
const validation = require('../Validations/authValidations.js');
const checkAuth = require('../Middleware/checkAuth.js');

Router.post('/login', validation.loginValidation, authController.login);
Router.post('/register', validation.registerValidation, authController.register);
Router.get('/me', checkAuth, authController.getUser);

module.exports = Router;