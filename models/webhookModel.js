const mongoose = require('mongoose');

// Define the schema for webhook events
const webhookSchema = new mongoose.Schema({
  eventId: { 
    type: String, 
    required: true, 
    unique: true,  // Ensure each event is unique by its eventId
  },
  eventType: { 
    type: String, 
    required: true,  // The type of the Stripe event (e.g., 'payment_intent.succeeded')
  },
  data: { 
    type: Object, 
    required: true,  // The actual data associated with the event
  },
  receivedAt: { 
    type: Date, 
    default: Date.now,  // Timestamp when the event was received
  },
  processed: { 
    type: Boolean, 
    default: false,  // Whether the event has been processed (optional)
  },
});

// Create a model based on the schema
const WebhookEvent = mongoose.model('WebhookEvent', webhookSchema);

module.exports = WebhookEvent;
