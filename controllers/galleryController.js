const GalleryPage = require('../models/galleryPageModel');

const getOrCreateGalleryPage = async () => {
  let page = await GalleryPage.findOne();

  if (!page) {
    page = new GalleryPage({
      header: {
        title: 'Gallery - Church History',
      },
    });
    await page.save();
  }

  return page;
};

const getGalleryPage = async (req, res) => {
  try {
    const page = await getOrCreateGalleryPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGalleryPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Gallery - Church History',
      };
    }

    let page = await GalleryPage.findOne();

    if (!page) {
      page = new GalleryPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
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
      displayOrder,
      image: {
        data: base64Data,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        page: 'gallery',
        section: albumName || category || 'general',
      },
    };

    const page = await getOrCreateGalleryPage();

    if (!Array.isArray(page.images)) {
      page.images = [];
    }

    page.images.push(newEntry);

    await page.save();

    res.status(201).json({
      message: 'Gallery image uploaded successfully.',
      images: page.images,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getGalleryPage,
  updateGalleryPage,
  uploadGalleryImage,
};
