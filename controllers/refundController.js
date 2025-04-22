const Payment = require('../models/Payment');

// Create a new refund
exports.createRefund = async (req, res) => {
  try {
    const { paymentId, amount, refundReason } = req.body;

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

 
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Refund can only be created for completed payments' });
    }

    
    payment.refund = {
      status: 'processed',
      amount,
      refundReason,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    
    payment.status = 'refunded';
    await payment.save();

    res.status(201).json(payment); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all refunds
exports.getAllRefunds = async (req, res) => {
  try {
    const payments = await Payment.find({ 'refund.status': { $exists: true } });
    const refunds = payments.map(payment => payment.refund);
    res.status(200).json(refunds);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single refund by payment ID
exports.getRefundByPaymentId = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment || !payment.refund || payment.refund.status === 'pending') {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.status(200).json(payment.refund);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a refund
exports.deleteRefund = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment || !payment.refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }

    payment.refund.status = 'pending';
    payment.refund = {};
    await payment.save();

    res.status(200).json({ message: 'Refund deleted and payment reverted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
