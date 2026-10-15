const express = require('express');
const router = express.Router();
const { createAbuseReport } = require('../controllers/abuseController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createAbuseReport);

module.exports = router;
