const Payment = require('../models/Payment.js');
const stripe = require('../config/stripe.js');

// @desc Create a payment
// @route POST /api/payment
// @access Private
const createPayment = async (req, res) => {
  try {
    const { amount, currency, provider, paymentMethod, description } = req.body;

    // Validate input fields
    if (!amount || !currency || !provider || !paymentMethod) {
      return res.status(400).json({ message: 'Amount, currency, provider, and paymentMethod are required' });
    }

    if (provider === 'stripe') {
      try {
        // Create and confirm the payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method: paymentMethod,
          description,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never', // Prevents Stripe from requiring a return_url
          },
        });

        const status = paymentIntent.status === 'succeeded' ? 'completed' : 'failed';
        const transactionId = paymentIntent.id;

        // Save to DB
        const payment = new Payment({
          user: req.user._id,
          amount,
          currency,
          provider,
          transactionId,
          status,
        });

        await payment.save();
        res.status(201).json({ message: 'Payment successful', payment });
      } catch (error) {
        console.error('Stripe error:', error);
        return res.status(400).json({ message: 'Stripe error', error: error.message });
      }
    } else {
      return res.status(400).json({ message: 'Invalid provider' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing error', error: error.message });
  }
};

// @desc Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// @desc Get single payment
const getPaymentById = async (req, res) => {
  try {
    // Find payment by id and ensure it belongs to the logged-in user (protect middleware ensures user is authenticated)
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

    // If payment doesn't exist, return a 404 error
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Return the payment details
    res.status(200).json(payment);
  } catch (error) {
    // Log the error for debugging and return a 500 error
    console.error(error);  // Optional: Logs error to console
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};


// @desc Update payment
const updatePayment = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = status || payment.status;
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};

// @desc Delete payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
