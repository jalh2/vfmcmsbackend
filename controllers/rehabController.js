const RehabPage = require('../models/rehabPageModel');

const getOrCreateRehabPage = async () => {
  let page = await RehabPage.findOne();

  if (!page) {
    page = new RehabPage({
      header: {
        title: 'Addict to Disciple Program',
      },
      startDate: '2016-01-01',
    });
    await page.save();
  }

  return page;
};

const getRehabPage = async (req, res) => {
  try {
    const page = await getOrCreateRehabPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRehabPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Addict to Disciple Program',
      };
    }

    let page = await RehabPage.findOne();

    if (!page) {
      page = new RehabPage(payload);
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
      page: 'rehab',
      section: 'header-background',
    };

    const page = await getOrCreateRehabPage();

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

const uploadGalleryImage = async (req, res) => {
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
      displayOrder:
        displayOrder !== undefined && displayOrder !== ''
          ? Number(displayOrder)
          : undefined,
      image: {
        data: base64Data,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        page: 'rehab',
        section: 'gallery',
      },
    };

    const page = await getOrCreateRehabPage();

    if (!Array.isArray(page.galleryImages)) {
      page.galleryImages = [];
    }

    page.galleryImages.push(newEntry);

    await page.save();

    res.status(201).json({
      message: 'Gallery image uploaded successfully.',
      galleryImages: page.galleryImages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRehabPage,
  updateRehabPage,
  uploadHeaderBackgroundImage,
  uploadGalleryImage,
};
