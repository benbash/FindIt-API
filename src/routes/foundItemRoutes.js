import express from 'express';
import {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
} from '../controllers/foundItemController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateObjectIdParam,
  validateFoundItemCreate,
  validateFoundItemUpdate,
} from '../middleware/validateRequest.js';

const router = express.Router();

router.route('/').get(getFoundItems).post(protect, validateFoundItemCreate, createFoundItem);

router
  .route('/:id')
  .patch(protect, validateObjectIdParam('id'), validateFoundItemUpdate, updateFoundItem)
  .delete(protect, validateObjectIdParam('id'), deleteFoundItem);

export default router;
