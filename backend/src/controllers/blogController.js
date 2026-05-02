const Blog = require('../models/Blog');
const axios = require('axios');

const uploadToImgBB = async (file) => {
  const imageBase64 = file.buffer.toString('base64');
  const formData = new URLSearchParams();
  formData.append('image', imageBase64);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData
  );
  return res.data.data.url;
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    const blogData = { ...req.body };
    
    // Parse content if it's sent as a string (common with FormData)
    if (typeof blogData.content === 'string') {
      blogData.content = JSON.parse(blogData.content);
    }

    if (req.files) {
      if (req.files.image) {
        blogData.image = await uploadToImgBB(req.files.image[0]);
      }
      if (req.files.image2) {
        blogData.image2 = await uploadToImgBB(req.files.image2[0]);
      }
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const updateData = { ...req.body };
    
    if (typeof updateData.content === 'string') {
      updateData.content = JSON.parse(updateData.content);
    }

    if (req.files) {
      if (req.files.image) {
        updateData.image = await uploadToImgBB(req.files.image[0]);
      }
      if (req.files.image2) {
        updateData.image2 = await uploadToImgBB(req.files.image2[0]);
      }
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await blog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
