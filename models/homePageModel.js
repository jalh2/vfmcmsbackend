const mongoose = require('mongoose');
const { imageSchema, socialLinkSchema } = require('./commonSchemas');

const heroMessageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    body: { type: String },
    order: { type: Number },
  },
  { _id: false }
);

const featuredProgramSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['academy', 'clinic', 'rehab', 'actsFellowship'],
      required: true,
    },
    title: { type: String },
    description: { type: String },
    image: imageSchema,
    order: { type: Number },
  },
  { _id: false }
);

const homePageSchema = new mongoose.Schema(
  {
    header: {
      logo: imageSchema,
      organizationName: { type: String, required: true },
    },
    heroMessages: {
      type: [heroMessageSchema],
      default: [],
    },
    heroImages: {
      type: [imageSchema],
      default: [],
    },
    mottoText: { type: String },
    featuredActivities: {
      weeklySnippet: { type: String },
      monthlySnippet: { type: String },
      yearlySnippet: { type: String },
    },
    featuredNewsSnippet: {
      title: { type: String },
      summary: { type: String },
      linkUrl: { type: String },
    },
    featuredTestimonies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestimonyPost',
      },
    ],
    featuredPrograms: {
      type: [featuredProgramSchema],
      default: [],
    },
    contactSection: {
      phone: { type: String },
      email: { type: String },
      location: { type: String },
      contactFormSnippet: { type: String },
    },
    footer: {
      organizationName: { type: String },
      phone: { type: String },
      email: { type: String },
      address: { type: String },
      socialLinks: [socialLinkSchema],
      copyrightText: { type: String },
    },
  },
  { timestamps: true }
);

const HomePage = mongoose.model('HomePage', homePageSchema);

module.exports = HomePage;
