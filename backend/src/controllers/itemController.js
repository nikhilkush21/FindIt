const Item = require('../models/Item');
const Match = require('../models/Match');
const ClaimRequest = require('../models/ClaimRequest');
const { deleteImage } = require('../utils/cloudinary');
const { findMatchesForItem } = require('../utils/matchingService');

const ITEMS_PER_PAGE = 12;

// GET /api/v1/items
const getItems = async (req, res, next) => {
  try {
    const { type, category, search, status = 'open', page = 1, limit = ITEMS_PER_PAGE, sort = 'newest' } = req.query;
    const filter = { isDeleted: false, moderationStatus: 'approved' };

    if (type && ['lost', 'found'].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      date_desc: { date: -1 },
      date_asc: { date: 1 },
    };
    const sortOpt = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const populateFields = req.user ? 'name email phone' : 'name';

    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('reportedBy', populateFields)
        .sort(sortOpt)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Item.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/items/:id
const getItem = async (req, res, next) => {
  try {
    const populateFields = req.user ? 'name email phone' : 'name';
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false })
      .populate('reportedBy', populateFields);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    // Hide unapproved items from non-admins/non-owners
    if (item.moderationStatus !== 'approved') {
      const isOwner = req.user && item.reportedBy._id.toString() === req.user._id.toString();
      const isAdmin = req.user?.role === 'admin';
      if (!isOwner && !isAdmin) return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/items
const createItem = async (req, res, next) => {
  try {
    const { type, title, description, category, location, date, identifyingFeatures } = req.body;

    const images = (req.files || []).map((f) => f.path || `/uploads/${f.filename}`);
    // Fallback for single file upload
    if (req.file) images.push(req.file.path || `/uploads/${req.file.filename}`);

    const item = await Item.create({
      type, title, description, category, location,
      date: new Date(date),
      identifyingFeatures: identifyingFeatures || '',
      images,
      reportedBy: req.user._id,
    });

    await item.populate('reportedBy', 'name email phone');

    // Async matching — don't block the response
    setImmediate(() => findMatchesForItem(item.toObject()));

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/items/:id
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const fields = ['title', 'description', 'category', 'location', 'date', 'status', 'identifyingFeatures'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) item[f] = f === 'date' ? new Date(req.body[f]) : req.body[f];
    });

    // New images uploaded
    if (req.files?.length) {
      item.images = req.files.map((f) => f.path || `/uploads/${f.filename}`);
    } else if (req.file) {
      item.images = [req.file.path || `/uploads/${req.file.filename}`];
    }

    // Reset embeddings so matching reruns
    item.textEmbedding = '';
    item.imageEmbedding = '';
    item.embeddingUpdatedAt = undefined;

    await item.save();
    await item.populate('reportedBy', 'name email phone');

    // Re-run matching after update
    setImmediate(() => findMatchesForItem(item.toObject()));

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/items/:id
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    // Soft delete
    item.isDeleted = true;
    await item.save();

    // Clean up Cloudinary images
    for (const url of item.images) {
      if (url.startsWith('http')) await deleteImage(url);
    }

    // Remove associated matches
    await Match.deleteMany({ $or: [{ lostItem: item._id }, { foundItem: item._id }] });

    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/items/my
const getMyItems = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = { reportedBy: req.user._id, isDeleted: false };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const items = await Item.find(filter).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/items/:id/matches
const getMatches = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const query = item.type === 'lost'
      ? { lostItem: item._id }
      : { foundItem: item._id };

    const matches = await Match.find({
      ...query,
      aiStatus: { $in: ['completed', 'fallback'] },
      dismissedBy: { $ne: req.user._id },
    })
      .sort({ overallScore: -1 })
      .populate({ path: 'lostItem', select: 'title images location date category type status' })
      .populate({ path: 'foundItem', select: 'title images location date category type status reportedBy' })
      .lean();

    res.json(matches);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/items/:id/matches/:matchId/dismiss
const dismissMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.dismissedBy.includes(req.user._id)) {
      match.dismissedBy.push(req.user._id);
      await match.save();
    }
    res.json({ message: 'Match dismissed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems, getItem, createItem, updateItem, deleteItem,
  getMyItems, getMatches, dismissMatch,
};
