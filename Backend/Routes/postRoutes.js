const express = require('express');
const Router = express.Router();
const postController = require('../Controllers/postController.js');
const validation = require('../Validations/postValidations.js');
const checkAuth = require('../Middleware/checkAuth.js');

// Post routes 
Router.post('/posts', checkAuth, validation.postCreateValidation, postController.createPost);
Router.get('/posts', checkAuth, postController.getPosts);
Router.get('/posts/:id', postController.getPostById);
Router.patch('/posts/:id', checkAuth, postController.updatePost);
Router.delete('/posts/:id', checkAuth, postController.deletePost);
Router.get('/my-posts', checkAuth, postController.getMyPosts);

// Comment routes
Router.post('/posts/:id/comments', checkAuth, postController.addComment);
Router.get('/posts/:id/comments', postController.getComments);
Router.delete('/posts/:id/comments/:commentId', checkAuth, postController.deleteComment);

// Like route
Router.post('/posts/:id/like', checkAuth, postController.toggleLike);

// Bookmark routes
Router.post('/bookmark/:id', checkAuth, postController.toggleBookmark);
Router.get('/bookmarks', checkAuth, postController.getBookmarks);

module.exports = Router;