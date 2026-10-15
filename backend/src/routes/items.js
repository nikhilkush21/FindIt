const express = require('express');
const router = express.Router();
const {
  getItems, getItem, createItem, updateItem, deleteItem,
  getMyItems, getMatches, dismissMatch,
} = require('../controllers/itemController');
const { createClaim, getClaimsForItem } = require('../controllers/claimController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createItemSchema, updateItemSchema, claimSchema } = require('../validators/itemValidators');
const { upload } = require('../utils/cloudinary');

// Public (optional auth)
router.get('/', optionalAuth, getItems);
router.get('/my', protect, getMyItems);
router.get('/:id', optionalAuth, getItem);

// Matches (owner only)
router.get('/:id/matches', protect, getMatches);
router.post('/:id/matches/:matchId/dismiss', protect, dismissMatch);

// Claims
router.post('/:id/claims', protect, validate(claimSchema), createClaim);
router.get('/:id/claims', protect, getClaimsForItem);

// CRUD
router.post('/', protect, upload.array('images', 4), validate(createItemSchema), createItem);
router.put('/:id', protect, upload.array('images', 4), validate(updateItemSchema), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
