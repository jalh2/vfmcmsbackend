const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const actsFellowshipPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    overviewText: { type: String },
    foundedYear: { type: Number },
    visionText: { type: String },
    partnershipsText: { type: String },
    galleries: {
      type: [galleryImageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const ActsFellowshipPage = mongoose.model('ActsFellowshipPage', actsFellowshipPageSchema);

module.exports = ActsFellowshipPage;
