const express = require('express');
const Router = express.Router();
const postController = require('../Controllers/postController.js');
const validation = require('../Validations/postValidations.js');
const checkAuth = require('../Middleware/checkAuth.js');

Router.post('/posts', checkAuth, validation.postCreateValidation, postController.createPost);
Router.get('/posts', postController.getPosts);
Router.get('/posts/:id', postController.getPostById);
Router.patch('/posts/:id', checkAuth, postController.updatePost);
Router.delete('/posts/:id', checkAuth, postController.deletePost);

module.exports = Router;