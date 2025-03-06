const Subscription = require('../models/Subscription');

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subscriptions (Admin only)
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete subscription
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription };
