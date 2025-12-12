const { Property, User } = require('../models');

/**
 * Create a new property
 */
exports.createProperty = async (req, res) => {
    try {
        const { address, type, area, photos, description, monthlyRent } = req.body;

        // Validate input
        if (!address || !type || !area) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Verify user is landlord
        const user = await User.findByPk(req.userId);
        if (user.role !== 'landlord') {
            return res.status(403).json({
                success: false,
                message: 'Only landlords can create properties'
            });
        }

        const property = await Property.create({
            ownerId: req.userId,
            address,
            type,
            area,
            photos: photos || [],
            description,
            monthlyRent,
            status: 'available'
        });

        return res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property
        });
    } catch (error) {
        console.error('Create property error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create property',
            error: error.message
        });
    }
};

/**
 * Get all properties (with filters)
 */
exports.getProperties = async (req, res) => {
    try {
        const { status, type, ownerId } = req.query;

        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (ownerId) where.ownerId = ownerId;

        const properties = await Property.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        console.error('Get properties error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch properties',
            error: error.message
        });
    }
};

/**
 * Get single property
 */
exports.getProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'blockchainAddress']
                }
            ]
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('Get property error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch property',
            error: error.message
        });
    }
};

/**
 * Update property
 */
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, type, area, photos, description, monthlyRent } = req.body;

        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Verify ownership
        if (property.ownerId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this property'
            });
        }

        // Update fields
        if (address) property.address = address;
        if (type) property.type = type;
        if (area) property.area = area;
        if (photos) property.photos = photos;
        if (description) property.description = description;
        if (monthlyRent) property.monthlyRent = monthlyRent;

        await property.save();

        return res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: property
        });
    } catch (error) {
        console.error('Update property error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update property',
            error: error.message
        });
    }
};

/**
 * Delete property
 */
exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Verify ownership
        if (property.ownerId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this property'
            });
        }

        // Check if property is rented
        if (property.status === 'rented') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a rented property. Terminate the contract first.'
            });
        }

        await property.destroy();

        return res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error('Delete property error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete property',
            error: error.message
        });
    }
};

/**
 * Get landlord's properties
 */
exports.getMyProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { ownerId: req.userId },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        console.error('Get my properties error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch properties',
            error: error.message
        });
    }
};
