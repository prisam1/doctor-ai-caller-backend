const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// create intent (protected)
router.post('/create-payment-intent', authMiddleware, paymentController.createPaymentIntent);

// webhook endpoint (no auth) - must be configured in Stripe dashboard to point to this URL
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhookHandler);

router.get('/history', authMiddleware, paymentController.getHistory);

module.exports = router;
