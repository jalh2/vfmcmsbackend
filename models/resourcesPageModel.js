const mongoose = require('mongoose');
const { imageSchema, mediaSchema } = require('./commonSchemas');

const resourcesPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    teachingVideos: {
      type: [mediaSchema],
      default: [],
    },
    otSessions: {
      type: [mediaSchema],
      default: [],
    },
    ntSessions: {
      type: [mediaSchema],
      default: [],
    },
    dbsSessions: {
      type: [mediaSchema],
      default: [],
    },
    nurturingSessions: {
      type: [mediaSchema],
      default: [],
    },
    audioLessons: {
      type: [mediaSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const ResourcesPage = mongoose.model('ResourcesPage', resourcesPageSchema);

module.exports = ResourcesPage;
