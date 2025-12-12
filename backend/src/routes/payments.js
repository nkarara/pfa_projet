const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/contract/:contractId', paymentController.getContractPayments);
router.post('/:id/record', paymentController.recordPayment);
router.get('/overdue', paymentController.getOverduePayments);
router.get('/stats', paymentController.getPaymentStats);

module.exports = router;
