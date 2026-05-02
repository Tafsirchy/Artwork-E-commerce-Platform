const mongoose = require('mongoose');

const blogBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'quote', 'heading', 'image']
  },
  text: String, // Used for paragraph, quote, heading
  url: String,  // Used for image
  caption: String // Used for image
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a subtitle'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt']
  },
  author: {
    type: String,
    default: 'Admin'
  },
  role: {
    type: String,
    default: 'Curator'
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  image: {
    type: String,
    required: [true, 'Please add a featured image']
  },
  image2: {
    type: String,
    default: ''
  },
  content: [blogBlockSchema],
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
