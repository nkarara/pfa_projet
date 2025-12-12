const { Payment, Contract } = require('../models');

/**
 * Get payments for a contract
 */
exports.getContractPayments = async (req, res) => {
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
                message: 'Not authorized to view these payments'
            });
        }

        const payments = await Payment.findAll({
            where: { contractId },
            order: [['due_date', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Get payments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payments',
            error: error.message
        });
    }
};

/**
 * Record a payment from blockchain
 */
exports.recordPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { transactionHash, paidDate, penalty } = req.body;

        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Payment already recorded'
            });
        }

        payment.status = 'paid';
        payment.paidDate = paidDate || new Date();
        payment.transactionHash = transactionHash;
        if (penalty) payment.penalty = penalty;

        await payment.save();

        return res.status(200).json({
            success: true,
            message: 'Payment recorded successfully',
            data: payment
        });
    } catch (error) {
        console.error('Record payment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record payment',
            error: error.message
        });
    }
};

/**
 * Get overdue payments
 */
exports.getOverduePayments = async (req, res) => {
    try {
        const { Op } = require('sequelize');

        const payments = await Payment.findAll({
            where: {
                status: {
                    [Op.in]: ['pending', 'overdue']
                },
                dueDate: {
                    [Op.lt]: new Date()
                }
            },
            include: [
                {
                    model: Contract,
                    as: 'contract',
                    where: {
                        [Op.or]: [
                            { landlordId: req.userId },
                            { tenantId: req.userId }
                        ]
                    }
                }
            ],
            order: [['due_date', 'ASC']]
        });

        // Update status to overdue
        for (const payment of payments) {
            if (payment.status === 'pending') {
                payment.status = 'overdue';
                await payment.save();
            }
        }

        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Get overdue payments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch overdue payments',
            error: error.message
        });
    }
};

/**
 * Get payment statistics
 */
exports.getPaymentStats = async (req, res) => {
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

        const totalPayments = await Payment.count({
            where: { contractId: { [Op.in]: contractIds } }
        });

        const paidPayments = await Payment.count({
            where: {
                contractId: { [Op.in]: contractIds },
                status: 'paid'
            }
        });

        const overduePayments = await Payment.count({
            where: {
                contractId: { [Op.in]: contractIds },
                status: 'overdue'
            }
        });

        const pendingPayments = await Payment.count({
            where: {
                contractId: { [Op.in]: contractIds },
                status: 'pending',
                dueDate: { [Op.gte]: new Date() }
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                total: totalPayments,
                paid: paidPayments,
                overdue: overduePayments,
                pending: pendingPayments
            }
        });
    } catch (error) {
        console.error('Get payment stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payment statistics',
            error: error.message
        });
    }
};
