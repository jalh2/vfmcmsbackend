const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const actsFellowshipPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    overviewTitle: { type: String },
    overviewText: { type: String },
    overviewImage: imageSchema,
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
