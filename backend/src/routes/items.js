const express = require('express');
const router = express.Router();
const {
  createItem, getItems, getItem, updateItem, deleteItem, getMyItems, getSuggestions,
} = require('../controllers/itemController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, getItems);
router.get('/my', protect, getMyItems);
router.get('/:id', optionalAuth, getItem);
router.get('/:id/suggestions', protect, getSuggestions);
router.post('/', protect, upload.single('image'), createItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
