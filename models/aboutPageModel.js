const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['ministerial', 'administrative', 'functional'],
      required: true,
    },
    description: { type: String },
    image: imageSchema,
  },
  { _id: false }
);

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    isInternational: { type: Boolean, default: false },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String },
    bio: { type: String },
    image: imageSchema,
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    organizationBio: {
      text: { type: String },
      image: imageSchema,
    },
    mission: { type: String },
    vision: { type: String },
    coreBeliefs: { type: String },
    motto: { type: String },
    history: {
      text: { type: String },
      image: imageSchema,
    },
    founder: {
      name: { type: String, default: 'Bishop Andrew Gombay' },
      title: { type: String, default: 'General Overseer' },
      bio: { type: String },
      image: imageSchema,
    },
    headquartersAddress: { type: String },
    branches: {
      type: [branchSchema],
      default: [],
    },
    churchStructure: {
      departments: {
        type: [departmentSchema],
        default: [],
      },
    },
    growthStatistics: {
      membersCount: { type: Number },
      branchesCount: { type: Number },
      internationalBranchesCount: { type: Number },
      foundedYear: { type: Number },
    },
    leadershipTeam: {
      type: [leaderSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const AboutPage = mongoose.model('AboutPage', aboutPageSchema);

module.exports = AboutPage;
