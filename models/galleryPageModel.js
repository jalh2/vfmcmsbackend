const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const galleryPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    description: { type: String },
    images: {
      type: [galleryImageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const GalleryPage = mongoose.model('GalleryPage', galleryPageSchema);

module.exports = GalleryPage;
