const express = require('express');
const { createSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createSubscription);         // Create subscription
router.get('/', protect, getAllSubscriptions);         // Get all subscriptions (Admin only)
router.get('/:id', protect, getSubscriptionById);      // Get subscription by ID
router.put('/:id', protect, updateSubscription);       // Update subscription
router.delete('/:id', protect, deleteSubscription);    // Delete subscription

module.exports = router;
