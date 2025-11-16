const mongoose = require('mongoose');
const { imageSchema, galleryImageSchema } = require('./commonSchemas');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const clinicPageSchema = new mongoose.Schema(
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
    services: {
      type: [serviceSchema],
      default: [],
    },
    galleryImages: {
      type: [galleryImageSchema],
      default: [],
    },
    contactInfo: {
      address: { type: String },
      phone: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

const ClinicPage = mongoose.model('ClinicPage', clinicPageSchema);

module.exports = ClinicPage;
