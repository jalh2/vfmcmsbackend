const ResourcesPage = require('../models/resourcesPageModel');

const getOrCreateResourcesPage = async () => {
  let page = await ResourcesPage.findOne();

  if (!page) {
    page = new ResourcesPage({
      header: {
        title: 'Acts Fellowship Resources / Training',
      },
    });
    await page.save();
  }

  return page;
};

const getResourcesPage = async (req, res) => {
  try {
    const page = await getOrCreateResourcesPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateResourcesPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Acts Fellowship Resources / Training',
      };
    }

    let page = await ResourcesPage.findOne();

    if (!page) {
      page = new ResourcesPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addMediaToSection = async (req, res, sectionKey, fieldName) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const base64Data = req.file.buffer.toString('base64');

    const media = {
      data: base64Data,
      title: req.body && req.body.title ? req.body.title : req.file.originalname,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'resources',
      section: sectionKey,
    };

    const page = await getOrCreateResourcesPage();

    if (!Array.isArray(page[fieldName])) {
      page[fieldName] = [];
    }

    page[fieldName].push(media);

    await page.save();

    res.status(201).json({
      message: 'Media uploaded successfully.',
      [fieldName]: page[fieldName],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadTeachingVideo = (req, res) => addMediaToSection(req, res, 'teaching-videos', 'teachingVideos');
const uploadOtSession = (req, res) => addMediaToSection(req, res, 'ot-sessions', 'otSessions');
const uploadNtSession = (req, res) => addMediaToSection(req, res, 'nt-sessions', 'ntSessions');
const uploadDbsSession = (req, res) => addMediaToSection(req, res, 'dbs-sessions', 'dbsSessions');
const uploadNurturingSession = (req, res) => addMediaToSection(req, res, 'nurturing-sessions', 'nurturingSessions');
const uploadAudioLesson = (req, res) => addMediaToSection(req, res, 'audio-lessons', 'audioLessons');

module.exports = {
  getResourcesPage,
  updateResourcesPage,
  uploadTeachingVideo,
  uploadOtSession,
  uploadNtSession,
  uploadDbsSession,
  uploadNurturingSession,
  uploadAudioLesson,
};
