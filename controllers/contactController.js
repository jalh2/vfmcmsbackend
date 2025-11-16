const ContactPage = require('../models/contactPageModel');

const getOrCreateContactPage = async () => {
  let page = await ContactPage.findOne();

  if (!page) {
    page = new ContactPage({
      header: {
        title: 'Contact Us',
      },
    });
    await page.save();
  }

  return page;
};

const getContactPage = async (req, res) => {
  try {
    const page = await getOrCreateContactPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateContactPage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Contact Us',
      };
    }

    let page = await ContactPage.findOne();

    if (!page) {
      page = new ContactPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getContactPage,
  updateContactPage,
};
