const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const testimonyPostSchema = new mongoose.Schema(
  {
    title: { type: String },
    author: { type: String },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['salvation', 'healing', 'family', 'youth', 'other'],
      default: 'other',
    },
    image: imageSchema,
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TestimonyPost = mongoose.model('TestimonyPost', testimonyPostSchema);

module.exports = TestimonyPost;
