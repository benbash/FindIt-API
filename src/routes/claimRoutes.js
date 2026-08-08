import express from 'express';
import {
  createClaim,
  getClaims,
  updateClaim,
} from '../controllers/claimController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateObjectIdParam,
  validateClaimCreate,
  validateClaimUpdate,
} from '../middleware/validateRequest.js';

const router = express.Router();

router.route('/').post(protect, validateClaimCreate, createClaim).get(protect, getClaims);

router
  .route('/:id')
  .patch(protect, validateObjectIdParam('id'), validateClaimUpdate, updateClaim);

export default router;
