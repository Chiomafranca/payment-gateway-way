const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const verifyStripeSignature = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

  try {

    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    req.event = event;

    next();
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    res.status(400).send('Webhook signature verification failed');
  }
};

module.exports = verifyStripeSignature;
