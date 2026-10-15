const express = require('express');
const router = express.Router();
const { getMyClaims, reviewClaim, withdrawClaim } = require('../controllers/claimController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewClaimSchema } = require('../validators/itemValidators');

router.get('/my', protect, getMyClaims);
router.put('/:id/review', protect, validate(reviewClaimSchema), reviewClaim);
router.delete('/:id', protect, withdrawClaim);

module.exports = router;
