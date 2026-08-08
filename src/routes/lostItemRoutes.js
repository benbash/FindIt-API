import express from 'express';
import {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
} from '../controllers/lostItemController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateObjectIdParam,
  validateLostItemCreate,
  validateLostItemUpdate,
} from '../middleware/validateRequest.js';

const router = express.Router();

router.route('/').get(getLostItems).post(protect, validateLostItemCreate, createLostItem);

router
  .route('/:id')
  .get(validateObjectIdParam('id'), getLostItemById)
  .patch(protect, validateObjectIdParam('id'), validateLostItemUpdate, updateLostItem)
  .delete(protect, validateObjectIdParam('id'), deleteLostItem);

export default router;
