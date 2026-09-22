const express = require('express');
const { clerkWebhook } = require('../controllers/webhookController');

const router = express.Router();

// The webhook controller handles the POST request from Clerk
router.post('/clerk', clerkWebhook);

module.exports = router;
