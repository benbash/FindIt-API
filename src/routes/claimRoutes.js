const express = require('express');
const {
  createClaim,
  getClaims,
  updateClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateObjectIdParam,
  validateClaimCreate,
  validateClaimUpdate,
} = require('../middleware/validateRequest');

const router = express.Router();

router.route('/').post(protect, validateClaimCreate, createClaim).get(protect, getClaims);

router
  .route('/:id')
  .patch(protect, validateObjectIdParam('id'), validateClaimUpdate, updateClaim);

module.exports = router;
