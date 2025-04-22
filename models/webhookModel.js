const mongoose = require('mongoose');

// Define the schema for webhook events
const webhookSchema = new mongoose.Schema(
  {
    eventId: { 
      type: String, 
      required: true, 
      unique: true, 
    },
    eventType: { 
      type: String, 
      required: true, 
    },
    data: { 
      type: Object, 
      required: true,  
    },
    receivedAt: { 
      type: Date, 
      default: Date.now, 
    },
    processed: { 
      type: Boolean, 
      default: false,  
    },
    processedAt: { 
      type: Date, 
      required: false, 
    },
  },
  { timestamps: true }
);


webhookSchema.index({ eventId: 1, eventType: 1 });

const WebhookEvent = mongoose.model('WebhookEvent', webhookSchema);

module.exports = WebhookEvent;
