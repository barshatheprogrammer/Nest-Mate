const express = require('express');
const router = express.Router();
const { getFlats, getFlatById, createFlat } = require('../controllers/flatController');
const { expressInterest, getInterestedUsers, getMyInterests } = require('../controllers/interestController');
const { protect } = require('../middleware/authMiddleware');

// Note: Ensure the auth middleware is imported correctly. I'll assume it's in middleware/auth.js

// Flat routes
router.route('/').get(getFlats).post(protect, createFlat);
router.route('/my-interests').get(protect, getMyInterests); // This must come before /:id to not be treated as an ID
router.route('/:id').get(getFlatById);

// Interest routes
router.route('/:id/interest').post(protect, expressInterest);
router.route('/:id/interested-users').get(protect, getInterestedUsers);

module.exports = router;
