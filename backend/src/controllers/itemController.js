const Item = require('../models/Item');

const createItem = async (req, res) => {
  try {
    const { type, title, description, category, location, date } = req.body;
    if (!type || !title || !description || !location || !date)
      return res.status(400).json({ message: 'All fields required' });

    const item = await Item.create({
      type,
      title,
      description,
      category: category || 'Other',
      location,
      date,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      reportedBy: req.user._id,
    });
    await item.populate('reportedBy', 'name email phone');
    res.status(201).json(item);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { type, category, search, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    // Only expose contact details to authenticated users
    const populateFields = req.user ? 'name email phone' : 'name';
    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('reportedBy', populateFields)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getItem = async (req, res) => {
  try {
    // Only expose contact details to authenticated users
    const populateFields = req.user ? 'name email phone' : 'name';
    const item = await Item.findById(req.params.id).populate('reportedBy', populateFields);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Get item error:', err);
    res.status(500).json({ message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.reportedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const fields = ['title', 'description', 'category', 'location', 'date', 'status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) item[f] = req.body[f]; });
    if (req.file) item.image = `/uploads/${req.file.filename}`;

    await item.save();
    await item.populate('reportedBy', 'name email phone');
    res.json(item);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.reportedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Get my items error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const oppositeType = item.type === 'lost' ? 'found' : 'lost';

    const suggestions = await Item.find({
      type: oppositeType,
      status: 'open',
      _id: { $ne: item._id },
      category: item.category,
    })
      .populate('reportedBy', 'name email phone')
      .limit(5);

    res.json(suggestions);
  } catch (err) {
    console.error('Get suggestions error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createItem, getItems, getItem, updateItem, deleteItem, getMyItems, getSuggestions };
