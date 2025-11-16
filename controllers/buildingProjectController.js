const BuildingProjectPage = require('../models/buildingProjectPageModel');

const getOrCreateBuildingProjectPage = async () => {
  let page = await BuildingProjectPage.findOne();

  if (!page) {
    page = new BuildingProjectPage({
      header: {
        title: 'Building Project',
      },
    });
    await page.save();
  }

  return page;
};

const getBuildingProjectPage = async (req, res) => {
  try {
    const page = await getOrCreateBuildingProjectPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBuildingProjectPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Building Project',
      };
    }

    let page = await BuildingProjectPage.findOne();

    if (!page) {
      page = new BuildingProjectPage(payload);
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
      page: 'building-project',
      section: 'header-background',
    };

    const page = await getOrCreateBuildingProjectPage();

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

const uploadReasonImpactImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const newImage = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'building-project',
      section: 'reason-impact',
    };

    const page = await getOrCreateBuildingProjectPage();

    page.reasonAndImpact = page.reasonAndImpact || {};
    page.reasonAndImpact.image = newImage;

    await page.save();

    res.status(201).json({
      message: 'Reason/impact image uploaded successfully.',
      reasonAndImpact: page.reasonAndImpact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadFloodGalleryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const { caption, description } = req.body;

    const base64Data = req.file.buffer.toString('base64');

    const newEntry = {
      caption,
      description,
      image: {
        data: base64Data,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        page: 'building-project',
        section: 'flood-gallery',
      },
    };

    const page = await getOrCreateBuildingProjectPage();

    if (!Array.isArray(page.floodGallery)) {
      page.floodGallery = [];
    }

    page.floodGallery.push(newEntry);

    await page.save();

    res.status(201).json({
      message: 'Flood gallery image uploaded successfully.',
      floodGallery: page.floodGallery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBuildingProjectPage,
  updateBuildingProjectPage,
  uploadHeaderBackgroundImage,
  uploadReasonImpactImage,
  uploadFloodGalleryImage,
};
