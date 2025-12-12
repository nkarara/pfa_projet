const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate, isLandlord } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// Landlord-only routes
router.post('/', isLandlord, propertyController.createProperty);
router.get('/my/properties', isLandlord, propertyController.getMyProperties);
router.put('/:id', isLandlord, propertyController.updateProperty);
router.delete('/:id', isLandlord, propertyController.deleteProperty);

module.exports = router;
