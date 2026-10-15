const AbuseReport = require('../models/AbuseReport');

// POST /api/v1/abuse-reports
const createAbuseReport = async (req, res, next) => {
  try {
    const { reportedItem, reportedUser, reason, details } = req.body;

    if (!reportedItem && !reportedUser) {
      return res.status(400).json({ message: 'Provide a reportedItem or reportedUser' });
    }

    // Rate-limit: one report per user per resource per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await AbuseReport.findOne({
      reporter: req.user._id,
      ...(reportedItem ? { reportedItem } : { reportedUser }),
      createdAt: { $gte: oneDayAgo },
    });
    if (recent) {
      return res.status(429).json({ message: 'You have already reported this recently. Please wait 24 hours.' });
    }

    const report = await AbuseReport.create({
      reporter: req.user._id,
      reportedItem,
      reportedUser,
      reason,
      details: details || '',
    });

    res.status(201).json({ message: 'Report submitted. Thank you for helping keep FindIt safe.', report });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAbuseReport };
