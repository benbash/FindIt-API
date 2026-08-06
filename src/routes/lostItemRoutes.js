const express = require('express');
const {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
} = require('../controllers/lostItemController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateObjectIdParam,
  validateLostItemCreate,
  validateLostItemUpdate,
} = require('../middleware/validateRequest');

const router = express.Router();

router.route('/').get(getLostItems).post(protect, validateLostItemCreate, createLostItem);

router
  .route('/:id')
  .get(validateObjectIdParam('id'), getLostItemById)
  .patch(protect, validateObjectIdParam('id'), validateLostItemUpdate, updateLostItem)
  .delete(protect, validateObjectIdParam('id'), deleteLostItem);

module.exports = router;
