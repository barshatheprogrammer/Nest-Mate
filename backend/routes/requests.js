const express = require('express');
const router = express.Router();
const { sendRequest, getReceivedRequests, getSentRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendRequest);
router.route('/received').get(protect, getReceivedRequests);
router.route('/sent').get(protect, getSentRequests);
router.route('/:id').put(protect, updateRequestStatus);

module.exports = router;
