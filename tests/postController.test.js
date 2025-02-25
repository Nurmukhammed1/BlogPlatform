// tests/postController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const PostModel = require('../Backend/Models/Post');
const CommentModel = require('../Backend/Models/Comment');
const Notification = require('../Backend/Models/Notification');
const Bookmark = require('../Backend/Models/Bookmark');
const postRoutes = require('../Backend/Routes/postRoutes');

// Mock models and dependencies
jest.mock('../Backend/Models/Post');
jest.mock('../Backend/Models/Comment');
jest.mock('../Backend/Models/Notification');
jest.mock('../Backend/Models/Bookmark');
jest.mock('jsonwebtoken');
jest.mock('../Backend/Middleware/checkAuth'); // Adjust the path to match your project structure

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(postRoutes);

describe('Post Controller Tests', () => {
  const mockUser = { _id: 'user123', username: 'testuser' };
  const mockPost = { 
    _id: 'post123',
    title: 'Test Post',
    text: 'Test content',
    author: mockUser._id,
    likes: [],
    likeCount: 0,
    comments: [],
    bookmarksCount: 0
  };
  const mockComment = {
    _id: 'comment123',
    text: 'Test comment',
    author: mockUser._id,
    post: mockPost._id
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock JWT verification
    jwt.verify.mockImplementation((token, secret, callback) => {
      return { _id: mockUser._id };
    });
  });

  describe('Create Post', () => {
    test('should create a new post successfully', async () => {
      // Mock PostModel.save
      const mockSave = jest.fn().mockResolvedValue(mockPost);
      PostModel.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Bearer fake_token')
        .send({ title: 'Test Post', text: 'Test content' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPost);
      expect(PostModel).toHaveBeenCalledWith({
        title: 'Test Post',
        text: 'Test content',
        author: mockUser._id
      });
    });

    test('should return 500 when post creation fails', async () => {
      // Mock PostModel.save to throw an error
      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      PostModel.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Bearer fake_token')
        .send({ title: 'Test Post', text: 'Test content' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to create post');
    });
  });

  describe('Get Posts', () => {
    test('should get all posts successfully', async () => {
      // Mock PostModel.find.populate.exec
      PostModel.find = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockResolvedValue([mockPost]);

      const response = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockPost]);
      expect(PostModel.find).toHaveBeenCalled();
    });

    test('should return 500 when getting posts fails', async () => {
      // Mock PostModel.find to throw an error
      PostModel.find = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to get posts');
    });
  });

  describe('Get Post By ID', () => {
    test('should get a post by ID successfully', async () => {
      // Mock PostModel.findById.populate.exec
      PostModel.findById = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockResolvedValue(mockPost);

      const response = await request(app)
        .get('/posts/post123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPost);
      expect(PostModel.findById).toHaveBeenCalledWith('post123');
    });

    test('should return 500 when getting post by ID fails', async () => {
      // Mock PostModel.findById to throw an error
      PostModel.findById = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/posts/post123');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to get post by id');
    });
  });

  describe('Delete Post', () => {
    test('should delete a post successfully', async () => {
      // Mock PostModel.findByIdAndDelete
      PostModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockPost);

      const response = await request(app)
        .delete('/posts/post123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith('post123');
    });

    test('should return 500 when deleting post fails', async () => {
      // Mock PostModel.findByIdAndDelete to throw an error
      PostModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/posts/post123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete post');
    });
  });

  describe('Update Post', () => {
    test('should update a post successfully', async () => {
      // Mock PostModel.findByIdAndUpdate
      PostModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockPost,
        title: 'Updated Title',
        text: 'Updated content'
      });

      const response = await request(app)
        .patch('/posts/post123')
        .set('Authorization', 'Bearer fake_token')
        .send({ title: 'Updated Title', text: 'Updated content' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        { title: 'Updated Title', text: 'Updated content' },
        { new: true }
      );
    });

    test('should return 500 when updating post fails', async () => {
      // Mock PostModel.findByIdAndUpdate to throw an error
      PostModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/posts/post123')
        .set('Authorization', 'Bearer fake_token')
        .send({ title: 'Updated Title', text: 'Updated content' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update post');
    });
  });

  describe('Get My Posts', () => {
    test('should get user\'s posts successfully', async () => {
      // Mock PostModel.find.populate.exec
      PostModel.find = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockResolvedValue([mockPost]);

      const response = await request(app)
        .get('/my-posts')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockPost]);
      expect(PostModel.find).toHaveBeenCalledWith({ author: mockUser._id });
    });

    test('should return 500 when getting user\'s posts fails', async () => {
      // Mock PostModel.find to throw an error
      PostModel.find = jest.fn().mockReturnThis();
      PostModel.populate = jest.fn().mockReturnThis();
      PostModel.exec = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/my-posts')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to get my posts');
    });
  });

  describe('Add Comment', () => {
    test('should add a comment to a post successfully', async () => {
      // Mock PostModel.findById
      PostModel.findById = jest.fn().mockResolvedValue(mockPost);
      
      // Mock CommentModel.save
      const mockSave = jest.fn().mockResolvedValue(mockComment);
      CommentModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Mock PostModel.findByIdAndUpdate
      PostModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockPost,
        comments: [mockComment._id]
      });

      // Mock Notification.save
      const mockNotificationSave = jest.fn().mockResolvedValue({});
      Notification.mockImplementation(() => ({
        save: mockNotificationSave
      }));

      const response = await request(app)
        .post('/posts/post123/comments')
        .set('Authorization', 'Bearer fake_token')
        .send({ text: 'Test comment' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockComment);
      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(CommentModel).toHaveBeenCalledWith({
        text: 'Test comment',
        author: mockUser._id,
        post: 'post123'
      });
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        { $push: { comments: mockComment._id } }
      );
      expect(Notification).toHaveBeenCalledWith({
        recipient: mockPost.author,
        sender: mockUser._id,
        type: 'comment',
        post: 'post123'
      });
    });

    test('should return 500 when adding a comment fails', async () => {
      // Mock PostModel.findById to throw an error
      PostModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/posts/post123/comments')
        .set('Authorization', 'Bearer fake_token')
        .send({ text: 'Test comment' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to add comment');
    });
  });

  describe('Get Comments', () => {
    test('should get comments for a post successfully', async () => {
      // Mock CommentModel.find.populate.exec
      CommentModel.find = jest.fn().mockReturnThis();
      CommentModel.populate = jest.fn().mockReturnThis();
      CommentModel.exec = jest.fn().mockResolvedValue([mockComment]);

      const response = await request(app)
        .get('/posts/post123/comments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockComment]);
      expect(CommentModel.find).toHaveBeenCalledWith({ post: 'post123' });
    });

    test('should return 500 when getting comments fails', async () => {
      // Mock CommentModel.find to throw an error
      CommentModel.find = jest.fn().mockReturnThis();
      CommentModel.populate = jest.fn().mockReturnThis();
      CommentModel.exec = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/posts/post123/comments');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to get comments');
    });
  });

  describe('Delete Comment', () => {
    test('should delete a comment successfully', async () => {
      // Mock CommentModel.findById
      CommentModel.findById = jest.fn().mockResolvedValue(mockComment);
      
      // Mock PostModel.findByIdAndUpdate
      PostModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockPost,
        comments: []
      });

      // Mock CommentModel.findByIdAndDelete
      CommentModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockComment);

      const response = await request(app)
        .delete('/posts/post123/comments/comment123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(CommentModel.findById).toHaveBeenCalledWith('comment123');
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        { $pull: { comments: 'comment123' } }
      );
      expect(CommentModel.findByIdAndDelete).toHaveBeenCalledWith('comment123');
    });

    test('should return 404 when comment not found', async () => {
      // Mock CommentModel.findById to return null
      CommentModel.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/posts/post123/comments/comment123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Comment not found');
    });

    test('should return 500 when deleting comment fails', async () => {
      // Mock CommentModel.findById to throw an error
      CommentModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/posts/post123/comments/comment123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete comment');
    });
  });

  describe('Toggle Like', () => {
    test('should add a like when post is not liked by user', async () => {
      // Mock PostModel.findById
      PostModel.findById = jest.fn().mockResolvedValue({
        ...mockPost,
        likes: []
      });
      
      // Mock PostModel.findByIdAndUpdate
      PostModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockPost,
        likes: [mockUser._id],
        likeCount: 1
      });

      // Mock Notification.save
      const mockNotificationSave = jest.fn().mockResolvedValue({});
      Notification.mockImplementation(() => ({
        save: mockNotificationSave
      }));

      const response = await request(app)
        .post('/posts/post123/like')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        {
          $push: { likes: mockUser._id },
          $inc: { likeCount: 1 }
        }
      );
      expect(Notification).toHaveBeenCalledWith({
        recipient: mockPost.author,
        sender: mockUser._id,
        type: 'like',
        post: 'post123'
      });
    });

    test('should remove a like when post is already liked by user', async () => {
      // Mock PostModel.findById
      PostModel.findById = jest.fn().mockResolvedValue({
        ...mockPost,
        likes: [mockUser._id],
        likeCount: 1
      });
      
      // Mock PostModel.findByIdAndUpdate
      PostModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockPost,
        likes: [],
        likeCount: 0
      });

      const response = await request(app)
        .post('/posts/post123/like')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        {
          $pull: { likes: mockUser._id },
          $inc: { likeCount: -1 }
        }
      );
      // No notification should be created
      expect(Notification).not.toHaveBeenCalled();
    });

    test('should return 404 when post not found', async () => {
      // Mock PostModel.findById to return null
      PostModel.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/posts/post123/like')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });

    test('should return 500 when toggling like fails', async () => {
      // Mock PostModel.findById to throw an error
      PostModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/posts/post123/like')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to like post');
    });
  });

  describe('Toggle Bookmark', () => {
    test('should add a bookmark when post is not bookmarked by user', async () => {
      // Mock Bookmark.findOne to return null (not bookmarked)
      Bookmark.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock Bookmark.save
      const mockSave = jest.fn().mockResolvedValue({
        user: mockUser._id,
        post: mockPost._id
      });
      Bookmark.mockImplementation(() => ({
        save: mockSave
      }));

      // Mock PostModel.updateOne
      PostModel.updateOne = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .post('/bookmark/post123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Bookmark added');
      expect(Bookmark.findOne).toHaveBeenCalledWith({ user: mockUser._id, post: 'post123' });
      expect(Bookmark).toHaveBeenCalledWith({
        user: mockUser._id,
        post: 'post123'
      });
      expect(PostModel.updateOne).toHaveBeenCalledWith(
        { _id: 'post123' },
        { $inc: { bookmarksCount: 1 } }
      );
    });

    test('should remove a bookmark when post is already bookmarked by user', async () => {
      // Mock Bookmark.findOne to return a bookmark
      const existingBookmark = {
        _id: 'bookmark123',
        user: mockUser._id,
        post: mockPost._id
      };
      Bookmark.findOne = jest.fn().mockResolvedValue(existingBookmark);
      
      // Mock Bookmark.deleteOne
      Bookmark.deleteOne = jest.fn().mockResolvedValue({});

      // Mock PostModel.updateOne
      PostModel.updateOne = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .post('/bookmark/post123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Bookmark removed');
      expect(Bookmark.findOne).toHaveBeenCalledWith({ user: mockUser._id, post: 'post123' });
      expect(Bookmark.deleteOne).toHaveBeenCalledWith({ _id: 'bookmark123' });
      expect(PostModel.updateOne).toHaveBeenCalledWith(
        { _id: 'post123' },
        { $inc: { bookmarksCount: -1 } }
      );
    });

    test('should return 500 when toggling bookmark fails', async () => {
      // Mock Bookmark.findOne to throw an error
      Bookmark.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/bookmark/post123')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to toggle bookmark');
    });
  });

  describe('Get Bookmarks', () => {
    test('should get user bookmarks successfully', async () => {
      // Mock Bookmark.find.populate.exec
      Bookmark.find = jest.fn().mockReturnThis();
      Bookmark.populate = jest.fn().mockReturnThis();
      Bookmark.exec = jest.fn().mockResolvedValue([{
        user: mockUser._id,
        post: mockPost
      }]);

      const response = await request(app)
        .get('/bookmarks')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{
        user: mockUser._id,
        post: mockPost
      }]);
      expect(Bookmark.find).toHaveBeenCalledWith({ user: mockUser._id });
    });

    test('should return 500 when getting bookmarks fails', async () => {
      // Mock Bookmark.find to throw an error
      Bookmark.find = jest.fn().mockReturnThis();
      Bookmark.populate = jest.fn().mockReturnThis();
      Bookmark.exec = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/bookmarks')
        .set('Authorization', 'Bearer fake_token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to get bookmarks');
    });
  });
});