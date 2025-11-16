const DonatePage = require('../models/donatePageModel');

const getOrCreateDonatePage = async () => {
  let page = await DonatePage.findOne();

  if (!page) {
    page = new DonatePage({
      header: {
        title: 'Donate',
      },
    });
    await page.save();
  }

  return page;
};

const getDonatePage = async (req, res) => {
  try {
    const page = await getOrCreateDonatePage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDonatePage = async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Donate',
      };
    }

    let page = await DonatePage.findOne();

    if (!page) {
      page = new DonatePage(payload);
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
  getDonatePage,
  updateDonatePage,
};
