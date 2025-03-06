const Payment = require('../models/Payment.js');
const stripe = require('../config/stripe.js');
const paypal = require('../config/paypal.js');

// @desc Create a payment
// @route POST /api/payment
// @access Private
const createPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethod, provider } = req.body;
        let paymentIntent;

        if (provider === 'stripe') {
            paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethod,
                confirm: true
            });
        } else if (provider === 'paypal') {
            paymentIntent = await paypal.createPayment(amount, currency);
        } else {
            return res.status(400).json({ message: 'Invalid payment provider' });
        }

        const payment = new Payment({
            user: req.user._id,
            amount,
            currency,
            provider,
            paymentId: paymentIntent.id,
            status: 'completed'
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Payment processing error' });
    }
};

// @desc Get all payments
// @route GET /api/payment
// @access Private
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments' });
    }
};

// @desc Get a single payment by ID
// @route GET /api/payment/:id
// @access Private
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment' });
    }
};

// @desc Update a payment
// @route PUT /api/payment/:id
// @access Private
const updatePayment = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status || payment.status;
        await payment.save();

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment' });
    }
};

// @desc Delete a payment
// @route DELETE /api/payment/:id
// @access Private
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        await payment.remove();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment' });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
