const ActsFellowshipPage = require('../models/actsFellowshipPageModel');

const getOrCreateActsFellowshipPage = async () => {
  let page = await ActsFellowshipPage.findOne();

  if (!page) {
    page = new ActsFellowshipPage({
      header: {
        title: 'Acts Fellowship International',
      },
      foundedYear: 2013,
    });
    await page.save();
  }

  return page;
};

const getActsFellowshipPage = async (req, res) => {
  try {
    const page = await getOrCreateActsFellowshipPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadActsOverviewImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'acts-fellowship',
      section: 'overview',
    };

    const page = await getOrCreateActsFellowshipPage();

    page.overviewImage = newImage;

    await page.save();

    res.status(201).json({
      message: 'Acts Fellowship overview image uploaded successfully.',
      overviewImage: page.overviewImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateActsFellowshipPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Acts Fellowship International',
      };
    }

    let page = await ActsFellowshipPage.findOne();

    if (!page) {
      page = new ActsFellowshipPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadActsGalleryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const { title, description, albumName, category, displayOrder } = req.body;

    const base64Data = req.file.buffer.toString('base64');

    const newEntry = {
      title,
      description,
      albumName,
      category,
      displayOrder,
      image: {
        data: base64Data,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        page: 'acts-fellowship',
        section: albumName || category || 'general',
      },
    };

    const page = await getOrCreateActsFellowshipPage();

    if (!Array.isArray(page.galleries)) {
      page.galleries = [];
    }

    page.galleries.push(newEntry);

    await page.save();

    res.status(201).json({
      message: 'Acts Fellowship gallery image uploaded successfully.',
      galleries: page.galleries,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getActsFellowshipPage,
  updateActsFellowshipPage,
  uploadActsOverviewImage,
  uploadActsGalleryImage,
};
