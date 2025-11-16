const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const impactMessageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const donatePageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    purposeText: { type: String },
    buildingProjectAppeal: {
      title: { type: String },
      text: { type: String },
    },
    campaigns: {
      type: [campaignSchema],
      default: [],
    },
    impactMessages: {
      type: [impactMessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const DonatePage = mongoose.model('DonatePage', donatePageSchema);

module.exports = DonatePage;
