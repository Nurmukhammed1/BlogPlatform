const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });  // Предотвращаем дублирование закладок

module.exports = mongoose.model('Bookmark', bookmarkSchema); 
