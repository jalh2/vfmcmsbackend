const TestimoniesPage = require('../models/testimoniesPageModel');
const TestimonyPost = require('../models/testimonyPostModel');

const getOrCreateTestimoniesPage = async () => {
  let page = await TestimoniesPage.findOne();

  if (!page) {
    page = new TestimoniesPage({
      header: {
        title: 'Testimonies',
      },
      categories: [
        { key: 'salvation', name: 'Salvation' },
        { key: 'healing', name: 'Healing' },
        { key: 'family', name: 'Family' },
        { key: 'youth', name: 'Youth' },
        { key: 'other', name: 'Other' },
      ],
    });
    await page.save();
  }

  return page;
};

const getTestimoniesPage = async (req, res) => {
  try {
    const page = await getOrCreateTestimoniesPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTestimoniesPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Testimonies',
      };
    }

    let page = await TestimoniesPage.findOne();

    if (!page) {
      page = new TestimoniesPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const listTestimonyPosts = async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const posts = await TestimonyPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTestimonyPost = async (req, res) => {
  try {
    const { title, author, description, category, status, isFeatured } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const post = await TestimonyPost.create({
      title,
      author,
      description,
      category,
      status,
      isFeatured,
    });

    res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTestimonyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, category, status, isFeatured } = req.body;

    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const post = await TestimonyPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Testimony not found.' });
    }

    if (title !== undefined) post.title = title;
    if (author !== undefined) post.author = author;
    if (description !== undefined) post.description = description;
    if (category !== undefined) post.category = category;
    if (status !== undefined) post.status = status;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;

    await post.save();

    res.json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTestimonyPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await TestimonyPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Testimony not found.' });
    }

    await post.deleteOne();

    res.json({ message: 'Testimony deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadTestimonyImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const { id } = req.params;
    const post = await TestimonyPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Testimony not found.' });
    }

    const base64Data = req.file.buffer.toString('base64');

    post.image = {
      data: base64Data,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      page: 'testimonies',
      section: 'post-image',
    };

    await post.save();

    res.status(201).json({
      message: 'Testimony image uploaded successfully.',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTestimoniesPage,
  updateTestimoniesPage,
  listTestimonyPosts,
  createTestimonyPost,
  updateTestimonyPost,
  deleteTestimonyPost,
  uploadTestimonyImage,
};
