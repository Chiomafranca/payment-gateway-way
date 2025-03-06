const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('./config/db');
//const paymentRoutes = require('./routes/paymentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const authRoutes = require('./routes/authRoutes.js');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const { webhookStripe, webhookPaypal } = require('./controllers/webhookController');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger.js');
const { connectQueue } = require('./queues/paymentQueue');
const cookieParser = require('cookie-parser');

const hpp = require('hpp');
const xssClean = require('xss-clean');
//const { validateEnv } = require('./utils/validateEnv');

const limiter = require('./middlewares/rateLimitMiddleware');

dotenv.config();

//validateEnv();

const startServer = () => {
  const app = express();


  // Security Middleware
  app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(','), credentials: true }));
  app.use(helmet());
  app.use(xssClean()); // Prevent XSS attacks
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression()); // Improves performance

  // API Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rate Limiting
  app.use(limiter);

  // Connect Queue
  connectQueue();

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/subscription', subscriptionRoutes);

  // Webhooks
  app.post('/webhook/stripe', express.raw({ type: 'application/json' }), webhookStripe);
  app.post('/webhook/paypal', webhookPaypal);

  // Error Handling Middleware
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Worker ${process.pid} running on port ${PORT}`));
};

module.exports = startServer;
