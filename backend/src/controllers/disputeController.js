const { Dispute, Contract, User } = require('../models');

/**
 * Create a new dispute
 */
exports.createDispute = async (req, res) => {
    try {
        const { contractId, description } = req.body;

        if (!contractId || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const contract = await Contract.findByPk(contractId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Verify user is party to contract
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to file dispute for this contract'
            });
        }

        const dispute = await Dispute.create({
            contractId,
            filedBy: req.userId,
            description,
            status: 'open'
        });

        return res.status(201).json({
            success: true,
            message: 'Dispute filed successfully',
            data: dispute
        });
    } catch (error) {
        console.error('Create dispute error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create dispute',
            error: error.message
        });
    }
};

/**
 * Get disputes for a contract
 */
exports.getContractDisputes = async (req, res) => {
    try {
        const { contractId } = req.params;

        const contract = await Contract.findByPk(contractId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Verify user is party to contract
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these disputes'
            });
        }

        const disputes = await Dispute.findAll({
            where: { contractId },
            include: [
                {
                    model: User,
                    as: 'filer',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'resolver',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: disputes
        });
    } catch (error) {
        console.error('Get disputes error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch disputes',
            error: error.message
        });
    }
};

/**
 * Get single dispute
 */
exports.getDispute = async (req, res) => {
    try {
        const { id } = req.params;

        const dispute = await Dispute.findByPk(id, {
            include: [
                {
                    model: Contract,
                    as: 'contract'
                },
                {
                    model: User,
                    as: 'filer',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'resolver',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        if (!dispute) {
            return res.status(404).json({
                success: false,
                message: 'Dispute not found'
            });
        }

        // Verify user is party to contract
        const contract = dispute.contract;
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this dispute'
            });
        }

        return res.status(200).json({
            success: true,
            data: dispute
        });
    } catch (error) {
        console.error('Get dispute error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dispute',
            error: error.message
        });
    }
};

/**
 * Resolve a dispute
 */
exports.resolveDispute = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution, transactionHash } = req.body;

        if (!resolution) {
            return res.status(400).json({
                success: false,
                message: 'Resolution is required'
            });
        }

        const dispute = await Dispute.findByPk(id, {
            include: [{ model: Contract, as: 'contract' }]
        });

        if (!dispute) {
            return res.status(404).json({
                success: false,
                message: 'Dispute not found'
            });
        }

        if (dispute.status === 'resolved') {
            return res.status(400).json({
                success: false,
                message: 'Dispute already resolved'
            });
        }

        // Verify user is party to contract
        const contract = dispute.contract;
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to resolve this dispute'
            });
        }

        dispute.resolution = resolution;
        dispute.status = 'resolved';
        dispute.resolvedAt = new Date();
        dispute.resolvedBy = req.userId;
        if (transactionHash) dispute.transactionHash = transactionHash;

        await dispute.save();

        return res.status(200).json({
            success: true,
            message: 'Dispute resolved successfully',
            data: dispute
        });
    } catch (error) {
        console.error('Resolve dispute error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resolve dispute',
            error: error.message
        });
    }
};

/**
 * Update dispute status
 */
exports.updateDisputeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['open', 'in_review', 'resolved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const dispute = await Dispute.findByPk(id, {
            include: [{ model: Contract, as: 'contract' }]
        });

        if (!dispute) {
            return res.status(404).json({
                success: false,
                message: 'Dispute not found'
            });
        }

        // Verify user is party to contract
        const contract = dispute.contract;
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this dispute'
            });
        }

        dispute.status = status;
        await dispute.save();

        return res.status(200).json({
            success: true,
            message: 'Dispute status updated successfully',
            data: dispute
        });
    } catch (error) {
        console.error('Update dispute status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update dispute status',
            error: error.message
        });
    }
};

/**
 * Get all user's disputes
 */
exports.getMyDisputes = async (req, res) => {
    try {
        const { Op } = require('sequelize');

        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [
                    { landlordId: req.userId },
                    { tenantId: req.userId }
                ]
            },
            attributes: ['id']
        });

        const contractIds = contracts.map(c => c.id);

        const disputes = await Dispute.findAll({
            where: {
                contractId: { [Op.in]: contractIds }
            },
            include: [
                {
                    model: Contract,
                    as: 'contract'
                },
                {
                    model: User,
                    as: 'filer',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: disputes
        });
    } catch (error) {
        console.error('Get my disputes error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch disputes',
            error: error.message
        });
    }
};
