const AcademyPage = require('../models/academyPageModel');

const getOrCreateAcademyPage = async () => {
  let page = await AcademyPage.findOne();

  if (!page) {
    page = new AcademyPage({
      header: {
        title: 'Academy / Refuge Home',
      },
    });
    await page.save();
  }

  return page;
};

const getAcademyPage = async (req, res) => {
  try {
    const page = await getOrCreateAcademyPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAcademyPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Academy / Refuge Home',
      };
    }

    let page = await AcademyPage.findOne();

    if (!page) {
      page = new AcademyPage(payload);
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
      page: 'academy',
      section: 'header-background',
    };

    const page = await getOrCreateAcademyPage();

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
      page: 'academy',
      section: 'establishment-story',
    };

    const page = await getOrCreateAcademyPage();

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

const uploadFacilitiesGalleryImage = async (req, res) => {
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
        page: 'academy',
        section: 'facilities-gallery',
      },
    };

    const page = await getOrCreateAcademyPage();

    if (!Array.isArray(page.facilitiesGallery)) {
      page.facilitiesGallery = [];
    }

    page.facilitiesGallery.push(newEntry);

    await page.save();

    res.status(201).json({
      message: 'Facilities gallery image uploaded successfully.',
      facilitiesGallery: page.facilitiesGallery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAcademyPage,
  updateAcademyPage,
  uploadHeaderBackgroundImage,
  uploadEstablishmentStoryImage,
  uploadFacilitiesGalleryImage,
};
