const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./Routes/auth.js');
const postRoutes = require('./Routes/postRoutes.js');

mongoose
    .connect('mongodb+srv://admin:12345@cluster0.r7c35.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));  

const app = express();

app.use(express.json());
app.use(cors()); 

// API Routes
app.use(authRoutes);
app.use(postRoutes);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/html/signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/html/login.html'));
});

app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});