const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
        status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
        provider: { type: String, enum: ['stripe', 'paypal'], required: true },
        transactionId: { type: String, required: true, unique: true },
        subscription: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Subscription', 
            required: false 
        },
        refund: {
            status: { 
                type: String, 
                enum: ['pending', 'processed', 'failed'], 
                default: 'pending' 
            },
            amount: { type: Number, required: false },
            refundReason: { type: String, required: false },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
