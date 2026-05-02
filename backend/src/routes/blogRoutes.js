const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, admin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, admin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]), updateBlog)
  .delete(protect, admin, deleteBlog);

module.exports = router;
