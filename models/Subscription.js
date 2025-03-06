const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        plan: { type: String, required: true },
        status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        provider: { type: String, enum: ['stripe', 'paypal'], required: true },
        subscriptionId: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);

