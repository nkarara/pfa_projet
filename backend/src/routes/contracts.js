const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authenticate } = require('../middleware/auth');

// All contract routes require authentication
router.use(authenticate);

router.post('/', contractController.createContract);
router.get('/my-contracts', contractController.getMyContracts);
router.get('/:id', contractController.getContract);
router.post('/:id/sign', contractController.signContract);
router.put('/:id/terminate', contractController.terminateContract);

module.exports = router;
