const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMatches);

module.exports = router;
