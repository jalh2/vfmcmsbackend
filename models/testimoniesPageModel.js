const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const categorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['salvation', 'healing', 'family', 'youth', 'other'],
    },
    name: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const testimoniesPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    introText: { type: String },
    categories: {
      type: [categorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const TestimoniesPage = mongoose.model('TestimoniesPage', testimoniesPageSchema);

module.exports = TestimoniesPage;
