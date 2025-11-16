const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: imageSchema,
  },
  { _id: false }
);

const academyPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    overviewText: { type: String },
    establishmentStory: {
      text: { type: String },
      image: imageSchema,
    },
    historyText: { type: String },
    programs: {
      type: [programSchema],
      default: [],
    },
    facilitiesGallery: {
      type: [galleryImageSchema],
      default: [],
    },
    enrollmentInfo: {
      text: { type: String },
    },
  },
  { timestamps: true }
);

const AcademyPage = mongoose.model('AcademyPage', academyPageSchema);

module.exports = AcademyPage;
