const mongoose = require('mongoose');
const { imageSchema } = require('./commonSchemas');

const activitySchema = new mongoose.Schema(
  {
    title: { type: String },
    day: { type: String },
    time: { type: String },
    description: { type: String },
    displayOrder: { type: Number },
  },
  { _id: false }
);

const activitiesPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    overviewText: { type: String },
    weeklyActivities: {
      type: [activitySchema],
      default: [],
    },
    monthlyActivities: {
      type: [activitySchema],
      default: [],
    },
    yearlyActivities: {
      type: [activitySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const ActivitiesPage = mongoose.model('ActivitiesPage', activitiesPageSchema);

module.exports = ActivitiesPage;
