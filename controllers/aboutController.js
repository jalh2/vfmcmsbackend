const AboutPage = require('../models/aboutPageModel');

const getOrCreateAboutPage = async () => {
  let page = await AboutPage.findOne();

  if (!page) {
    page = new AboutPage({
      header: {
        title: 'About Us - Church',
      },
    });
    await page.save();
  }

  return page;
};

const getAboutPage = async (req, res) => {
  try {
    const page = await getOrCreateAboutPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAboutPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'About Us - Church',
      };
    }

    let page = await AboutPage.findOne();

    if (!page) {
      page = new AboutPage(payload);
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
      page: 'about',
      section: 'header-background',
    };

    const page = await getOrCreateAboutPage();

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

const uploadOrganizationBioImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'about',
      section: 'organization-bio',
    };

    const page = await getOrCreateAboutPage();

    page.organizationBio = page.organizationBio || {};
    page.organizationBio.image = newImage;

    await page.save();

    res.status(201).json({
      message: 'Organization bio image uploaded successfully.',
      organizationBio: page.organizationBio,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadHistoryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'about',
      section: 'history',
    };

    const page = await getOrCreateAboutPage();

    page.history = page.history || {};
    page.history.image = newImage;

    await page.save();

    res.status(201).json({
      message: 'History image uploaded successfully.',
      history: page.history,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadFounderImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'about',
      section: 'founder',
    };

    const page = await getOrCreateAboutPage();

    page.founder = page.founder || {};
    page.founder.image = newImage;

    await page.save();

    res.status(201).json({
      message: 'Founder image uploaded successfully.',
      founder: page.founder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAboutPage,
  updateAboutPage,
  uploadHeaderBackgroundImage,
  uploadOrganizationBioImage,
  uploadHistoryImage,
  uploadFounderImage,
};
