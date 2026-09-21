const express = require('express');
const router = express.Router();
const { 
  getMyProfile, 
  createOrUpdateProfile, 
  getAllProfiles, 
  getProfileByUserId 
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyProfile);
router.post('/', protect, createOrUpdateProfile);
router.get('/all', protect, getAllProfiles);
router.get('/user/:user_id', protect, getProfileByUserId);

module.exports = router;
