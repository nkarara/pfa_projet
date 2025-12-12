const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please authenticate.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication error.',
            error: error.message
        });
    }
};

/**
 * Middleware to check if user is landlord
 */
const isLandlord = (req, res, next) => {
    if (req.user && req.user.role === 'landlord') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Landlord role required.'
        });
    }
};

/**
 * Middleware to check if user is tenant
 */
const isTenant = (req, res, next) => {
    if (req.user && req.user.role === 'tenant') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Tenant role required.'
        });
    }
};

module.exports = {
    authenticate,
    isLandlord,
    isTenant
};
