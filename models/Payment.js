const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        provider: { type: String, enum: ['stripe', 'paypal'], required: true },
        transactionId: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
