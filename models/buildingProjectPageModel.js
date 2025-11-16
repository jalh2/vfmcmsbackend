const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const floodImageSchema = new mongoose.Schema(
  {
    caption: { type: String },
    description: { type: String },
    image: imageSchema,
  },
  { _id: false }
);

const buildingProjectPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    projectOverview: {
      goal: { type: String },
      description: { type: String },
      estimatedBudget: { type: Number, default: 215000 },
      timeline: { type: String },
    },
    reasonAndImpact: {
      text: { type: String },
      image: imageSchema,
    },
    floodGallery: {
      type: [floodImageSchema],
      default: [],
    },
    donationCallToAction: {
      title: { type: String },
      message: { type: String },
    },
    projectStatus: {
      statusText: { type: String },
      progressPercentage: { type: Number, min: 0, max: 100 },
    },
    biblicalReference: {
      reference: { type: String },
      text: { type: String },
    },
  },
  { timestamps: true }
);

const BuildingProjectPage = mongoose.model('BuildingProjectPage', buildingProjectPageSchema);

module.exports = BuildingProjectPage;
