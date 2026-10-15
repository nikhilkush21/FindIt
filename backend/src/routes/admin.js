const express = require('express');
const router = express.Router();
const {
  getStats, getAdminItems, moderateItem,
  getUsers, updateUser, getAbuseReports, reviewAbuseReport,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/items', getAdminItems);
router.put('/items/:id/moderate', moderateItem);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/abuse-reports', getAbuseReports);
router.put('/abuse-reports/:id', reviewAbuseReport);

module.exports = router;
