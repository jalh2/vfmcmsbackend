const mongoose = require('mongoose');
const { imageSchema, socialLinkSchema } = require('./commonSchemas');

const contactPageSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      backgroundImage: imageSchema,
    },
    contactInfo: {
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    location: {
      mapEmbedCode: { type: String },
      mapUrl: { type: String },
    },
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const ContactPage = mongoose.model('ContactPage', contactPageSchema);

module.exports = ContactPage;
