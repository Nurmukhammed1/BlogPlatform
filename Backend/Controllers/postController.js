const PostModel = require('../Models/Post.js');

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
