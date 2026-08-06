const express = require('express');
const { searchItems } = require('../controllers/searchController');
const { validateItemSearchQuery } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/search', validateItemSearchQuery, searchItems);

module.exports = router;
