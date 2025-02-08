const express = require('express');
const Router = express.Router();
const checkAuth = require('../Middleware/checkAuth.js');
const notificationController = require('../Controllers/notificationController.js');

Router.get('/notifications', checkAuth, notificationController.getNotifications);

module.exports = Router;