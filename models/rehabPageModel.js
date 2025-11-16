const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const rehabPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    overviewText: { type: String },
    startDate: { type: String },
    motivationText: { type: String },
    trainingText: { type: String },
    resultsText: { type: String },
    galleryImages: {
      type: [galleryImageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const RehabPage = mongoose.model('RehabPage', rehabPageSchema);

module.exports = RehabPage;
