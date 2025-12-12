const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/', disputeController.createDispute);
router.get('/my-disputes', disputeController.getMyDisputes);
router.get('/contract/:contractId', disputeController.getContractDisputes);
router.get('/:id', disputeController.getDispute);
router.put('/:id/resolve', disputeController.resolveDispute);
router.put('/:id/status', disputeController.updateDisputeStatus);

module.exports = router;
