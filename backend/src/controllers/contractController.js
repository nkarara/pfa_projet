const { Contract, Property, User, Payment, Dispute } = require('../models');
const {
    deployRentalContract,
    deployPaymentManager,
    deployDisputeManager
} = require('../services/blockchain');

/**
 * Create a new contract and deploy smart contracts
 */
exports.createContract = async (req, res) => {
    try {
        const {
            propertyId,
            tenantId,
            rentAmount,
            durationMonths,
            depositAmount,
            terms
        } = req.body;

        // Sanitize tenantId
        let sanitizedTenantId = tenantId;
        if (!tenantId || tenantId === '' || tenantId === '0' || tenantId === 0) {
            sanitizedTenantId = null;
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const landlord = await User.findByPk(req.userId);
        if (!landlord) {
            return res.status(404).json({
                success: false,
                message: 'Landlord not found'
            });
        }

        // Validate tenant if provided
        let tenant = null;
        if (sanitizedTenantId) {
            tenant = await User.findByPk(sanitizedTenantId);
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }
        }

        const tenantAddress = tenant?.blockchainAddress || '0x0000000000000000000000000000000000000000';
        const landlordAddress = landlord.blockchainAddress || '0x0000000000000000000000000000000000000000';

        // Deploy smart contracts (temporarily disabled - compile contracts first)
        let rentalContractAddress = null;
        let paymentManagerAddress = null;
        let disputeManagerAddress = null;

        try {
            const fs = require('fs');
            fs.writeFileSync('debug_deploy.txt', `Attempting deployment...\nLandlord: ${landlordAddress}\nTenant: ${tenantAddress}\n`);
            fs.appendFileSync('debug_deploy.txt', `Params: Rent=${rentAmount}, Deposit=${depositAmount}, Duration=${durationMonths}, Property=${property.address}\n`);

            // Try to deploy if contracts are compiled AND addresses are set
            if (landlordAddress !== '0x0000000000000000000000000000000000000000') {
                rentalContractAddress = await deployRentalContract(landlordAddress, {
                    tenant: tenantAddress,
                    rentAmount,
                    depositAmount,
                    durationMonths,
                    propertyAddress: property.address,
                    terms: terms || 'Standard rental agreement'
                });

                paymentManagerAddress = await deployPaymentManager(landlordAddress, {
                    tenant: tenantAddress,
                    rentAmount,
                    startDate: Date.now(),
                    durationMonths,
                    penaltyRate: 5,
                    gracePeriodDays: 3
                });

                disputeManagerAddress = await deployDisputeManager(
                    landlordAddress,
                    tenantAddress
                );
                fs.appendFileSync('debug_deploy.txt', '✅ Deployment successful\n');
                console.log('✅ Smart contracts deployed successfully');
            } else {
                fs.appendFileSync('debug_deploy.txt', '⚠️ No blockchain address\n');
                console.warn('⚠️  No blockchain address - creating contract in database only');
            }
        } catch (error) {
            const fs = require('fs');
            fs.appendFileSync('debug_deploy.txt', `❌ Error: ${error.message}\nStack: ${error.stack}\n`);

            // THROW error to stop contract creation (Disable Database Mode)
            throw new Error(`Blockchain deployment failed: ${error.message}`);
        }

        // Create contract in database
        const contract = await Contract.create({
            propertyId,
            landlordId: req.userId,
            tenantId: sanitizedTenantId,
            smartContractAddress: rentalContractAddress,
            paymentManagerAddress,
            disputeManagerAddress,
            rentAmount,
            durationMonths,
            depositAmount,
            terms,
            status: 'draft'
        });

        // Generate payment schedule
        const payments = [];
        for (let i = 0; i < durationMonths; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i + 1);

            payments.push({
                contractId: contract.id,
                dueDate,
                amount: rentAmount,
                paymentIndex: i
            });
        }

        await Payment.bulkCreate(payments);

        return res.status(201).json({
            success: true,
            message: 'Contract created and smart contracts deployed successfully',
            data: contract
        });
    } catch (error) {
        console.error('Create contract error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create contract',
            error: error.message
        });
    }
};

/**
 * Get contract details
 */
exports.getContract = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await Contract.findByPk(id, {
            include: [
                { model: Property, as: 'property' },
                { model: User, as: 'landlord', attributes: ['id', 'firstName', 'lastName', 'email', 'blockchainAddress'] },
                { model: User, as: 'tenant', attributes: ['id', 'firstName', 'lastName', 'email', 'blockchainAddress'] },
                { model: Payment, as: 'payments' },
                { model: Dispute, as: 'disputes' }
            ]
        });

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Check if user is authorized to view
        if (contract.landlordId !== req.userId && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this contract'
            });
        }

        return res.status(200).json({
            success: true,
            data: contract
        });
    } catch (error) {
        console.error('Get contract error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch contract',
            error: error.message
        });
    }
};

/**
 * Get user's contracts
 */
exports.getMyContracts = async (req, res) => {
    try {
        const { Op } = require('sequelize');

        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [
                    { landlordId: req.userId },
                    { tenantId: req.userId }
                ]
            },
            include: [
                { model: Property, as: 'property' },
                { model: User, as: 'landlord', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: User, as: 'tenant', attributes: ['id', 'firstName', 'lastName', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: contracts
        });
    } catch (error) {
        console.error('Get contracts error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch contracts',
            error: error.message
        });
    }
};

/**
 * Record contract signature
 */
exports.signContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { transactionHash, party } = req.body; // party: 'landlord' or 'tenant'

        const contract = await Contract.findByPk(id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Verify user is a party to the contract
        if (party === 'landlord' && contract.landlordId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (party === 'tenant' && contract.tenantId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Update signature status
        if (party === 'landlord') {
            contract.landlordSigned = true;
            contract.status = 'pending_signature';
        } else if (party === 'tenant') {
            contract.tenantSigned = true;
            contract.status = 'active';
            contract.startDate = new Date();
            contract.endDate = new Date();
            contract.endDate.setMonth(contract.endDate.getMonth() + contract.durationMonths);

            // Update property status
            await Property.update(
                { status: 'rented' },
                { where: { id: contract.propertyId } }
            );
        }

        await contract.save();

        return res.status(200).json({
            success: true,
            message: 'Signature recorded successfully',
            data: contract
        });
    } catch (error) {
        console.error('Sign contract error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record signature',
            error: error.message
        });
    }
};

/**
 * Terminate contract
 */
exports.terminateContract = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await Contract.findByPk(id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Only landlord can terminate
        if (contract.landlordId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Only landlord can terminate contract'
            });
        }

        contract.status = 'terminated';
        await contract.save();

        // Update property status
        await Property.update(
            { status: 'available' },
            { where: { id: contract.propertyId } }
        );

        return res.status(200).json({
            success: true,
            message: 'Contract terminated successfully',
            data: contract
        });
    } catch (error) {
        console.error('Terminate contract error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to terminate contract',
            error: error.message
        });
    }
};
