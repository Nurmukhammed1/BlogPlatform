const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        likeCount: {
            type: Number,
            default: 0,
        },
        bookmarksCount: { 
            type: Number, 
            default: 0 
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema); 
