const ClaimRequest = require('../models/ClaimRequest');
const Item = require('../models/Item');
const { createNotification } = require('../utils/notifications');

// POST /api/v1/items/:id/claims
const createClaim = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false })
      .populate('reportedBy', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only 'found' items can be claimed by people looking for their item
    // (or lost items can be claimed by people who found it)
    if (item.status !== 'open') {
      return res.status(400).json({ message: 'This item is no longer accepting claims' });
    }

    // Prevent self-claiming
    if (item.reportedBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own report' });
    }

    // Check for existing claim
    const existing = await ClaimRequest.findOne({ item: item._id, claimant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a claim for this item' });
    }

    const { message, verificationAnswers } = req.body;

    const claim = await ClaimRequest.create({
      item: item._id,
      claimant: req.user._id,
      message,
      verificationAnswers: verificationAnswers || [],
    });

    // Notify item owner
    await createNotification({
      recipient: item.reportedBy._id,
      type: 'claim_received',
      title: 'New claim on your item',
      message: `Someone has submitted a claim for "${item.title}"`,
      relatedItem: item._id,
      relatedClaim: claim._id,
    });

    // Update item status
    item.status = 'claimed';
    await item.save();

    res.status(201).json(claim);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/items/:id/claims — item owner or admin only
const getClaimsForItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const claims = await ClaimRequest.find({ item: item._id })
      .populate('claimant', 'name email')
      .sort({ createdAt: -1 });

    // Hide private verification answers from non-owners unless admin
    const sanitized = claims.map((c) => {
      const obj = c.toObject();
      if (!isAdmin && !isOwner) obj.verificationAnswers = [];
      return obj;
    });

    res.json(sanitized);
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/claims/:id/review — item owner or admin
const reviewClaim = async (req, res, next) => {
  try {
    const claim = await ClaimRequest.findById(req.params.id).populate('item');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    const item = claim.item;
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim has already been reviewed' });
    }

    const { status, reviewNote } = req.body;
    claim.status = status;
    claim.reviewNote = reviewNote || '';
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();

    if (status === 'approved') {
      claim.contactShared = true;
      // Update item status
      await Item.findByIdAndUpdate(item._id, { status: 'resolved' });
      // Reject all other pending claims for this item
      await ClaimRequest.updateMany(
        { item: item._id, _id: { $ne: claim._id }, status: 'pending' },
        { status: 'rejected', reviewNote: 'Another claim was approved for this item.' }
      );
    } else if (status === 'rejected') {
      // Re-open the item if no other pending claims
      const otherPending = await ClaimRequest.countDocuments({
        item: item._id,
        _id: { $ne: claim._id },
        status: 'pending',
      });
      if (otherPending === 0) {
        await Item.findByIdAndUpdate(item._id, { status: 'open' });
      }
    }

    await claim.save();

    // Notify claimant
    await createNotification({
      recipient: claim.claimant,
      type: status === 'approved' ? 'claim_approved' : 'claim_rejected',
      title: status === 'approved' ? 'Your claim was approved!' : 'Your claim was rejected',
      message:
        status === 'approved'
          ? `Your claim for "${item.title}" has been approved. You can now contact the reporter.`
          : `Your claim for "${item.title}" was reviewed and not approved.`,
      relatedItem: item._id,
      relatedClaim: claim._id,
    });

    res.json(claim);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/claims/my
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await ClaimRequest.find({ claimant: req.user._id })
      .populate({ path: 'item', select: 'title type images location date status category' })
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/claims/:id — claimant withdraws
const withdrawClaim = async (req, res, next) => {
  try {
    const claim = await ClaimRequest.findOne({
      _id: req.params.id,
      claimant: req.user._id,
      status: 'pending',
    });
    if (!claim) return res.status(404).json({ message: 'Claim not found or already reviewed' });

    claim.status = 'withdrawn';
    await claim.save();

    // Re-open item if no other pending claims
    const otherPending = await ClaimRequest.countDocuments({
      item: claim.item,
      _id: { $ne: claim._id },
      status: 'pending',
    });
    if (otherPending === 0) {
      await Item.findByIdAndUpdate(claim.item, { status: 'open' });
    }

    res.json({ message: 'Claim withdrawn' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createClaim, getClaimsForItem, reviewClaim, getMyClaims, withdrawClaim };
