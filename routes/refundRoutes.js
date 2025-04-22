const express = require('express');
const { createRefund, getAllRefunds, getRefundByPaymentId, deleteRefund } = require('../controllers/refundController');

const router = express.Router();


router.post('/', createRefund);


router.get('/', getAllRefunds);


router.get('/:paymentId', getRefundByPaymentId);

router.delete('/:paymentId', deleteRefund);

module.exports = router;
