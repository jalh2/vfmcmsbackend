const HomePage = require('../models/homePageModel');

const DEFAULT_ORG_NAME = 'Victorious Faith Ministries - Redemption Chapel';

const getOrCreateHomePage = async () => {
  let home = await HomePage.findOne();

  if (!home) {
    home = new HomePage({
      header: {
        organizationName: DEFAULT_ORG_NAME,
      },
      mottoText: 'Lighting the world through the word',
    });
    await home.save();
  }

  return home;
};

const getHomePage = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHomePage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.organizationName) {
      payload.header = {
        ...(payload.header || {}),
        organizationName: DEFAULT_ORG_NAME,
      };
    }

    let home = await HomePage.findOne();

    if (!home) {
      home = new HomePage(payload);
    } else {
      home.set(payload);
    }

    await home.save();

    res.json(home);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadHeroImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'home',
      section: 'hero',
    };

    const home = await getOrCreateHomePage();

    if (!Array.isArray(home.heroImages)) {
      home.heroImages = [];
    }

    if (home.heroImages.length >= 4) {
      home.heroImages.shift();
    }

    home.heroImages.push(newImage);

    await home.save();

    res.status(201).json({
      message: 'Hero image uploaded successfully.',
      heroImages: home.heroImages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteHeroImage = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);

    if (Number.isNaN(index) || index < 0) {
      return res.status(400).json({ message: 'Invalid image index.' });
    }

    const home = await getOrCreateHomePage();

    if (!Array.isArray(home.heroImages) || index >= home.heroImages.length) {
      return res.status(404).json({ message: 'Hero image not found.' });
    }

    home.heroImages.splice(index, 1);

    await home.save();

    return res.json({
      message: 'Hero image deleted successfully.',
      heroImages: home.heroImages,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const uploadFeaturedProgramImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { key } = req.params;
  const allowedKeys = ['academy', 'clinic', 'rehab', 'actsFellowship'];

  if (!allowedKeys.includes(key)) {
    return res.status(400).json({ message: 'Invalid program key.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'home',
      section: `program-${key}`,
    };

    const home = await getOrCreateHomePage();

    if (!Array.isArray(home.featuredPrograms)) {
      home.featuredPrograms = [];
    }

    const existingIndex = home.featuredPrograms.findIndex((p) => p.key === key);

    if (existingIndex !== -1) {
      home.featuredPrograms[existingIndex].image = newImage;
    } else {
      home.featuredPrograms.push({ key, image: newImage });
    }

    await home.save();

    res.status(201).json({
      message: 'Featured program image uploaded successfully.',
      featuredPrograms: home.featuredPrograms,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadHeaderLogo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'home',
      section: 'header-logo',
    };

    const home = await getOrCreateHomePage();

    if (!home.header) {
      home.header = { organizationName: DEFAULT_ORG_NAME };
    }

    home.header.logo = newImage;

    await home.save();

    res.status(201).json({
      message: 'Header logo uploaded successfully.',
      header: home.header,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteHeaderLogo = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();

    if (!home.header || !home.header.logo) {
      return res.status(404).json({ message: 'Header logo not found.' });
    }

    home.header.logo = undefined;

    await home.save();

    return res.json({
      message: 'Header logo deleted successfully.',
      header: home.header,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getHomePage,
  updateHomePage,
  uploadHeroImage,
  deleteHeroImage,
  uploadFeaturedProgramImage,
  uploadHeaderLogo,
  deleteHeaderLogo,
};
