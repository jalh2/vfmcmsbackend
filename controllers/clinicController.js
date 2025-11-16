const ClinicPage = require('../models/clinicPageModel');

const getOrCreateClinicPage = async () => {
  let page = await ClinicPage.findOne();

  if (!page) {
    page = new ClinicPage({
      header: {
        title: 'Community Clinic',
      },
    });
    await page.save();
  }

  return page;
};

const getClinicPage = async (req, res) => {
  try {
    const page = await getOrCreateClinicPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateClinicPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Community Clinic',
      };
    }

    let page = await ClinicPage.findOne();

    if (!page) {
      page = new ClinicPage(payload);
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
      page: 'clinic',
      section: 'header-background',
    };

    const page = await getOrCreateClinicPage();

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

const uploadEstablishmentStoryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'clinic',
      section: 'establishment-story',
    };

    const page = await getOrCreateClinicPage();

    page.establishmentStory = page.establishmentStory || {};
    page.establishmentStory.image = newImage;

    await page.save();

    res.status(201).json({
      message: 'Establishment story image uploaded successfully.',
      establishmentStory: page.establishmentStory,
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
        page: 'clinic',
        section: 'gallery',
      },
    };

    const page = await getOrCreateClinicPage();

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
  getClinicPage,
  updateClinicPage,
  uploadHeaderBackgroundImage,
  uploadEstablishmentStoryImage,
  uploadGalleryImage,
};
