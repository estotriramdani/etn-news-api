const express = require('express');
const {
  createBlogPost,
  getAllBlogPosts,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blog');
const { body } = require('express-validator');
const router = express.Router();

const validation = [
  body('title').isLength({ min: 5 }).withMessage('Input title tidak sesuai'),
  body('body').isLength({ min: 5 }).withMessage('Body tidak sesuai'),
];

router.post('/post', validation, createBlogPost);
router.get('/posts', getAllBlogPosts);
router.get('/post/:slug', getBlogPostBySlug);
router.get('/category/:categoryName', getBlogPostByCategory);
router.put('/post/:slug', validation, updateBlogPost);
router.delete('/post/:slug', deleteBlogPost);

module.exports = router;
