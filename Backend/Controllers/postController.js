const PostModel = require('../Models/Post.js');
const CommentModel = require('../Models/Comment.js');
const Notification = require('../Models/Notification.js');
const Bookmark = require('../Models/Bookmark.js');
const { text } = require('express');
const { post } = require('../Routes/auth.js');

exports.createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            author: req.userId,
        })

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create post',
        });
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get posts',
        });
    }
}

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId).populate('author').exec();
        res.json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get post by id',
        });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findByIdAndDelete(postId);
        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete post',
        });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findByIdAndUpdate(postId, {
                title: req.body.title,
                text: req.body.text,
            }, 
            {
                new: true 
            }
        );

        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update post',
        });
    }
}


exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await PostModel.find({author: userId}).populate('author').exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get my posts',
        });
    }
}

 
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post = await PostModel.findById(postId);

        const comment = new CommentModel({
            text: req.body.text,
            author: req.userId,
            post: postId,
        });
        
        const savedComment = await comment.save();

        await PostModel.findByIdAndUpdate(postId, {
            $push: {
                comments: savedComment._id,
            }
        });

        const notification = new Notification({
            recipient: post.author,
            sender: userId,
            type: 'comment',
            post: postId
        });
        await notification.save();

        res.json(savedComment);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to add comment',
        });
    }
}

exports.getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentModel.find({post: postId}).populate('author').exec();
        res.json(comments);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get comments',
        });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.params.commentId;
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found',
            });
        }

        await PostModel.findByIdAndUpdate(postId, {
            $pull: { comments: commentId }
        });

        await CommentModel.findByIdAndDelete(commentId);

        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete comment',
        });
    }
}


exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
            })
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            await PostModel.findByIdAndUpdate(postId, {
                $pull: { likes: userId},
                $inc: {likeCount: -1},
            });
        } else {
            await PostModel.findByIdAndUpdate(postId, {
                $push: { likes: userId},
                $inc: {likeCount: 1},
            });
            const notification = new Notification({
                recipient: post.author,
                sender: userId,
                type: 'like',
                post: postId
            });
            await notification.save();
        } 

        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to like post',
        });
    }
}


exports.toggleBookmark = async (req, res) => { 
    const postId = req.params.id; 
    const userId = req.userId; 
 
    try { 
        const existingBookmark = await Bookmark.findOne({ user: userId, post: postId }); 
 
        if (existingBookmark) {  
            await Bookmark.deleteOne({ _id: existingBookmark._id }); 
            await PostModel.updateOne({ _id: postId }, { $inc: { bookmarksCount: -1 } }); 
            res.status(200).json({ message: 'Bookmark removed' }); 
        } else { 
            const newBookmark = new Bookmark({ 
                user: userId, 
                post: postId 
            }); 
            await newBookmark.save(); 
            await PostModel.updateOne({ _id: postId }, { $inc: { bookmarksCount: 1 } }); 
            res.status(201).json({ message: 'Bookmark added' }); 
        } 
    } catch (err) { 
        console.log(err); 
        res.status(500).json({ 
            message: 'Failed to toggle bookmark', 
        }); 
    } 
};

exports.getBookmarks = async (req, res) => {
    const userId = req.userId;
    try {
        const bookmarks = await Bookmark.find({ user: userId }).populate('post').exec();
        res.json(bookmarks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get bookmarks',
        });
    }
}