const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const paymentRoutes = require('./routes/paymentRoutes');
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
const connectDB = require('./config/db');
const hpp = require('hpp');
const xssClean = require('xss-clean');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');
const userRoute = require("./routes/userRoutes.js");
const refundRoutes = require('./routes/refundRoutes.js')

// Initialize dotenv
dotenv.config();

const app = express();

// DATABASE CONNECTION
connectDB();

// MIDDLEWARES
app.use(helmet());
app.use(xssClean()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression()); // Improves performance
app.use(apiLimiter); // Rate Limiting Middleware

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoutes);
app.use('/api/refunds', refundRoutes)

// Webhooks
// app.post('/webhook/stripe', express.raw({ type: 'application/json' }), webhookStripe);
// app.post('/webhook/paypal', webhookPaypal);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = () => {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Connect Queue
  // connectQueue();
};

startServer();
