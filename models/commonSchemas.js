const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    data: { type: String, required: true },
    filename: { type: String },
    contentType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    page: { type: String },
    section: { type: String },
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    albumName: { type: String },
    category: { type: String },
    displayOrder: { type: Number },
    image: imageSchema,
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    data: { type: String, required: true },
    filename: { type: String },
    contentType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    page: { type: String },
    section: { type: String },
  },
  { _id: false }
);

module.exports = {
  imageSchema,
  socialLinkSchema,
  galleryImageSchema,
  mediaSchema,
};
