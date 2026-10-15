const User = require('../models/User');
const Item = require('../models/Item');
const ClaimRequest = require('../models/ClaimRequest');
const AbuseReport = require('../models/AbuseReport');
const Notification = require('../models/Notification');
const Match = require('../models/Match');
const { createNotification } = require('../utils/notifications');

// GET /api/v1/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, activeUsers, totalItems, lostItems, foundItems,
      openItems, resolvedItems, pendingModeration,
      totalClaims, pendingClaims, approvedClaims,
      openAbuse,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Item.countDocuments({ isDeleted: false }),
      Item.countDocuments({ type: 'lost', isDeleted: false }),
      Item.countDocuments({ type: 'found', isDeleted: false }),
      Item.countDocuments({ status: 'open', isDeleted: false }),
      Item.countDocuments({ status: 'resolved', isDeleted: false }),
      Item.countDocuments({ moderationStatus: 'pending', isDeleted: false }),
      ClaimRequest.countDocuments(),
      ClaimRequest.countDocuments({ status: 'pending' }),
      ClaimRequest.countDocuments({ status: 'approved' }),
      AbuseReport.countDocuments({ status: 'open' }),
    ]);

    res.json({
      users: { total: totalUsers, active: activeUsers },
      items: { total: totalItems, lost: lostItems, found: foundItems, open: openItems, resolved: resolvedItems, pendingModeration },
      claims: { total: totalClaims, pending: pendingClaims, approved: approvedClaims },
      abuse: { open: openAbuse },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/items?moderation=pending
const getAdminItems = async (req, res, next) => {
  try {
    const { moderation, type, status, page = 1, limit = 20 } = req.query;
    const filter = { isDeleted: false };
    if (moderation) filter.moderationStatus = moderation;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('reportedBy', 'name email')
        .populate('moderatedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/admin/items/:id/moderate
const moderateItem = async (req, res, next) => {
  try {
    const { moderationStatus, moderationNote } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(moderationStatus)) {
      return res.status(400).json({ message: 'Invalid moderation status' });
    }

    const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.moderationStatus = moderationStatus;
    item.moderationNote = moderationNote || '';
    item.moderatedBy = req.user._id;
    item.moderatedAt = new Date();
    await item.save();

    if (moderationStatus === 'rejected') {
      await createNotification({
        recipient: item.reportedBy,
        type: 'item_moderated',
        title: 'Your report was removed',
        message: `Your report "${item.title}" was removed by a moderator. Reason: ${moderationNote || 'Policy violation'}`,
        relatedItem: item._id,
      });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20, role, active } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (active !== undefined) filter.isActive = active === 'true';
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot modify your own account here' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/abuse-reports
const getAbuseReports = async (req, res, next) => {
  try {
    const { status = 'open', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [reports, total] = await Promise.all([
      AbuseReport.find(filter)
        .populate('reporter', 'name email')
        .populate('reportedItem', 'title type')
        .populate('reportedUser', 'name email')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AbuseReport.countDocuments(filter),
    ]);

    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/admin/abuse-reports/:id
const reviewAbuseReport = async (req, res, next) => {
  try {
    const { status, adminAction } = req.body;
    const report = await AbuseReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    report.adminAction = adminAction || '';
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    await report.save();

    res.json(report);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats, getAdminItems, moderateItem,
  getUsers, updateUser, getAbuseReports, reviewAbuseReport,
};
