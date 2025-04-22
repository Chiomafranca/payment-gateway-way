const express = require('express');
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require('../controllers/paymentController.js');
const { protect } = require('../middlewares/authMiddleware.js'); 
const { apiLimiter } = require('../middlewares/rateLimitMiddleware.js');

const router = express.Router();

router.post('/', protect, apiLimiter, createPayment);
router.get('/', protect, getAllPayments);
router.get('/:id', protect, getPaymentById);
router.put('/:id', protect, updatePayment);
router.delete('/:id', protect, deletePayment);

module.exports = router;
