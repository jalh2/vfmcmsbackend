const ContactPage = require('../models/contactPageModel');

const getOrCreateContactPage = async () => {
  let page = await ContactPage.findOne();

  if (!page) {
    page = new ContactPage({
      header: {
        title: 'Contact Us',
      },
    });
    await page.save();
  }

  return page;
};

const getContactPage = async (req, res) => {
  try {
    const page = await getOrCreateContactPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateContactPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Contact Us',
      };
    }

    let page = await ContactPage.findOne();

    if (!page) {
      page = new ContactPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadHeaderBackgroundImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'contact',
      section: 'header-background',
    };

    const page = await getOrCreateContactPage();

    page.header = page.header || {};
    page.header.backgroundImage = newImage;

    await page.save();

    res.status(201).json({
      message: 'Header background image uploaded successfully.',
      header: page.header,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getContactPage,
  updateContactPage,
  uploadHeaderBackgroundImage,
};
