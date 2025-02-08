const express = require('express');
const Notification = require('../Models/Notification.js');

exports.getNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await Notification.find({ recipient: userId }).populate('sender').exec();
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
}

