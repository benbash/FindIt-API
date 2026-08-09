import express from 'express';
import { searchItems } from '../controllers/searchController.js';
import { validateItemSearchQuery } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/search', validateItemSearchQuery, searchItems);

export default router;
