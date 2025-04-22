// config/stripe.js
const Stripe = require('stripe');
require('dotenv').config();

console.log(process.env.STRIPE_SECRET_KEY);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // or the latest version
});

module.exports = stripe;
