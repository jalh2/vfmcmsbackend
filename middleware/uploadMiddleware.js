const multer = require('multer');

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
});

const mediaUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per media file (video/audio)
  },
});

module.exports = {
  imageUpload,
  mediaUpload,
};
