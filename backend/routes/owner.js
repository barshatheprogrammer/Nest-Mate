const express = require('express');
const router = express.Router();
const { protect, owner } = require('../middleware/authMiddleware');
const {
  addFlat,
  getOwnerFlats,
  getOwnerFlatById,
  updateOwnerFlat,
  deleteOwnerFlat,
  getOwnerInterests,
  getOwnerProfile,
  updateOwnerProfile
} = require('../controllers/ownerController');

// All owner routes require authentication and owner role
router.use(protect);
router.use(owner);

router.route('/flats')
  .get(getOwnerFlats)
  .post(addFlat);

router.route('/flats/:id')
  .get(getOwnerFlatById)
  .put(updateOwnerFlat)
  .delete(deleteOwnerFlat);

router.get('/interests', getOwnerInterests);

router.route('/profile')
  .get(getOwnerProfile)
  .put(updateOwnerProfile);

module.exports = router;
