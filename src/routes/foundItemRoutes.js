const express = require('express');
const {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
} = require('../controllers/foundItemController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateObjectIdParam,
  validateFoundItemCreate,
  validateFoundItemUpdate,
} = require('../middleware/validateRequest');

const router = express.Router();

router.route('/').get(getFoundItems).post(protect, validateFoundItemCreate, createFoundItem);

router
  .route('/:id')
  .patch(protect, validateObjectIdParam('id'), validateFoundItemUpdate, updateFoundItem)
  .delete(protect, validateObjectIdParam('id'), deleteFoundItem);

module.exports = router;
