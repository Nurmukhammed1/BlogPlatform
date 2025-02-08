const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


// Import routes
const authRoutes = require('./Routes/auth.js');
const postRoutes = require('./Routes/postRoutes.js');
const notificationRoutes = require('./Routes/notificationRoutes.js');

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));  

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
})); 

// API Routes
app.use(authRoutes);
app.use(postRoutes); 
app.use(notificationRoutes);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/html/signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/html/login.html'));
});

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});