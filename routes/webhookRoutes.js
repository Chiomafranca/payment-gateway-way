const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const verifyStripeSignature = require('../middleware/verifyStripeSignature');


router.post('/webhook', express.raw({ type: 'application/json' }), verifyStripeSignature, webhookController.saveEvent);


router.get('/webhooks', webhookController.getAllEvents);


router.get('/webhooks/:eventId', webhookController.getEventById);

router.patch('/webhooks/:eventId', webhookController.updateEvent);


router.delete('/webhooks/:eventId', webhookController.deleteEvent);

module.exports = router;
