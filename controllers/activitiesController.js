const ActivitiesPage = require('../models/activitiesPageModel');

const sanitizeActivities = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    const fields = ['title', 'day', 'time', 'description'];
    return fields.some((field) => {
      const value = item[field];
      return typeof value === 'string' && value.trim() !== '';
    });
  });
};

const getOrCreateActivitiesPage = async () => {
  let page = await ActivitiesPage.findOne();

  if (!page) {
    page = new ActivitiesPage({
      header: {
        title: 'Church Activities',
      },
    });
    await page.save();
  }

  return page;
};

const getActivitiesPage = async (req, res) => {
  try {
    const page = await getOrCreateActivitiesPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateActivitiesPage = async (req, res) => {
  try {
    const payload = req.body || {};

    console.log('updateActivitiesPage - raw body:', JSON.stringify(req.body));

    payload.weeklyActivities = sanitizeActivities(payload.weeklyActivities);
    payload.monthlyActivities = sanitizeActivities(payload.monthlyActivities);
    payload.yearlyActivities = sanitizeActivities(payload.yearlyActivities);

    console.log('updateActivitiesPage - sanitized lengths:', {
      weekly: Array.isArray(payload.weeklyActivities) ? payload.weeklyActivities.length : 0,
      monthly: Array.isArray(payload.monthlyActivities) ? payload.monthlyActivities.length : 0,
      yearly: Array.isArray(payload.yearlyActivities) ? payload.yearlyActivities.length : 0,
    });

    if (!payload.header || !payload.header.title) {
      payload.header = {
        ...(payload.header || {}),
        title: 'Church Activities',
      };
    }

    let page = await ActivitiesPage.findOne();

    if (!page) {
      page = new ActivitiesPage(payload);
    } else {
      page.set(payload);
    }

    await page.save();

    console.log('updateActivitiesPage - saved lengths:', {
      weekly: Array.isArray(page.weeklyActivities) ? page.weeklyActivities.length : 0,
      monthly: Array.isArray(page.monthlyActivities) ? page.monthlyActivities.length : 0,
      yearly: Array.isArray(page.yearlyActivities) ? page.yearlyActivities.length : 0,
    });

    res.json(page);
  } catch (error) {
    console.error('Error updating activities page:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getActivitiesPage,
  updateActivitiesPage,
};
