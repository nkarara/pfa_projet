const { listenToContractEvents, RentalContractABI, PaymentManagerABI, DisputeManagerABI } = require('./blockchain');
const { Contract, Payment, Dispute } = require('../models');

/**
 * Start listening to all active contracts
 */
const startEventListeners = async () => {
    try {
        console.log('🎧 Starting blockchain event listeners...');

        // Get all active contracts
        const contracts = await Contract.findAll({
            where: {
                status: ['active', 'pending_signature']
            }
        });

        console.log(`📋 Found ${contracts.length} active contracts to monitor`);

        contracts.forEach(contract => {
            if (contract.smartContractAddress) {
                listenToRentalContractEvents(contract);
            }
            if (contract.paymentManagerAddress) {
                listenToPaymentManagerEvents(contract);
            }
            if (contract.disputeManagerAddress) {
                listenToDisputeManagerEvents(contract);
            }
        });

        console.log('✅ Event listeners started successfully');
    } catch (error) {
        console.error('❌ Error starting event listeners:', error);
    }
};

/**
 * Listen to RentalContract events
 */
const listenToRentalContractEvents = (contract) => {
    const address = contract.smartContractAddress;

    // ContractSignedByLandlord event
    listenToContractEvents(address, RentalContractABI, 'ContractSignedByLandlord', async (event) => {
        console.log('🔔 ContractSignedByLandlord event:', event.returnValues);

        try {
            await Contract.update(
                {
                    landlordSigned: true,
                    status: 'pending_signature'
                },
                { where: { smartContractAddress: address } }
            );
            console.log('✅ Updated landlord signature in database');
        } catch (error) {
            console.error('❌ Error updating landlord signature:', error);
        }
    });

    // ContractSignedByTenant event
    listenToContractEvents(address, RentalContractABI, 'ContractSignedByTenant', async (event) => {
        console.log('🔔 ContractSignedByTenant event:', event.returnValues);

        try {
            const { timestamp } = event.returnValues;
            const startDate = new Date(Number(timestamp) * 1000);

            const contractData = await Contract.findOne({
                where: { smartContractAddress: address }
            });

            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + contractData.durationMonths);

            await Contract.update(
                {
                    tenantSigned: true,
                    status: 'active',
                    startDate,
                    endDate
                },
                { where: { smartContractAddress: address } }
            );

            console.log('✅ Contract activated in database');
        } catch (error) {
            console.error('❌ Error activating contract:', error);
        }
    });

    // ContractTerminated event
    listenToContractEvents(address, RentalContractABI, 'ContractTerminated', async (event) => {
        console.log('🔔 ContractTerminated event:', event.returnValues);

        try {
            await Contract.update(
                { status: 'terminated' },
                { where: { smartContractAddress: address } }
            );
            console.log('✅ Contract terminated in database');
        } catch (error) {
            console.error('❌ Error terminating contract:', error);
        }
    });
};

/**
 * Listen to PaymentManager events
 */
const listenToPaymentManagerEvents = (contract) => {
    const address = contract.paymentManagerAddress;

    // RentPaid event
    listenToContractEvents(address, PaymentManagerABI, 'RentPaid', async (event) => {
        console.log('🔔 RentPaid event:', event.returnValues);

        try {
            const { paymentId, amount, penalty, timestamp } = event.returnValues;
            const txHash = event.transactionHash;

            // Find payment by contract and payment index
            const payment = await Payment.findOne({
                where: {
                    contractId: contract.id,
                    paymentIndex: Number(paymentId)
                }
            });

            if (payment) {
                payment.status = 'paid';
                payment.paidDate = new Date(Number(timestamp) * 1000);
                payment.transactionHash = txHash;
                if (penalty) payment.penalty = penalty;

                await payment.save();
                console.log(`✅ Payment ${paymentId} recorded in database`);
            }
        } catch (error) {
            console.error('❌ Error recording payment:', error);
        }
    });

    // PenaltyApplied event
    listenToContractEvents(address, PaymentManagerABI, 'PenaltyApplied', async (event) => {
        console.log('🔔 PenaltyApplied event:', event.returnValues);

        try {
            const { paymentId, penaltyAmount } = event.returnValues;

            const payment = await Payment.findOne({
                where: {
                    contractId: contract.id,
                    paymentIndex: Number(paymentId)
                }
            });

            if (payment) {
                payment.penalty = penaltyAmount;
                payment.status = 'overdue';
                await payment.save();
                console.log(`✅ Penalty applied to payment ${paymentId}`);
            }
        } catch (error) {
            console.error('❌ Error applying penalty:', error);
        }
    });
};

/**
 * Listen to DisputeManager events
 */
const listenToDisputeManagerEvents = (contract) => {
    const address = contract.disputeManagerAddress;

    // DisputeCreated event
    listenToContractEvents(address, DisputeManagerABI, 'DisputeCreated', async (event) => {
        console.log('🔔 DisputeCreated event:', event.returnValues);

        try {
            const { disputeId, filedBy, description, timestamp } = event.returnValues;
            const txHash = event.transactionHash;

            // Check if dispute already exists in database
            const existingDispute = await Dispute.findOne({
                where: {
                    contractId: contract.id,
                    disputeIndex: Number(disputeId)
                }
            });

            if (!existingDispute) {
                // Find user by blockchain address
                const User = require('../models').User;
                const user = await User.findOne({
                    where: { blockchainAddress: filedBy.toLowerCase() }
                });

                if (user) {
                    await Dispute.create({
                        contractId: contract.id,
                        filedBy: user.id,
                        description,
                        status: 'open',
                        disputeIndex: Number(disputeId),
                        transactionHash: txHash
                    });
                    console.log(`✅ Dispute ${disputeId} created in database`);
                }
            }
        } catch (error) {
            console.error('❌ Error creating dispute:', error);
        }
    });

    // DisputeResolved event
    listenToContractEvents(address, DisputeManagerABI, 'DisputeResolved', async (event) => {
        console.log('🔔 DisputeResolved event:', event.returnValues);

        try {
            const { disputeId, resolvedBy, resolution, timestamp } = event.returnValues;

            const dispute = await Dispute.findOne({
                where: {
                    contractId: contract.id,
                    disputeIndex: Number(disputeId)
                }
            });

            if (dispute) {
                // Find resolver by blockchain address
                const User = require('../models').User;
                const resolver = await User.findOne({
                    where: { blockchainAddress: resolvedBy.toLowerCase() }
                });

                dispute.status = 'resolved';
                dispute.resolution = resolution;
                dispute.resolvedAt = new Date(Number(timestamp) * 1000);
                if (resolver) dispute.resolvedBy = resolver.id;

                await dispute.save();
                console.log(`✅ Dispute ${disputeId} resolved in database`);
            }
        } catch (error) {
            console.error('❌ Error resolving dispute:', error);
        }
    });
};

/**
 * Add listener for a new contract
 */
const addContractListener = async (contractId) => {
    try {
        const contract = await Contract.findByPk(contractId);

        if (!contract) {
            console.error('Contract not found:', contractId);
            return;
        }

        if (contract.smartContractAddress) {
            listenToRentalContractEvents(contract);
        }
        if (contract.paymentManagerAddress) {
            listenToPaymentManagerEvents(contract);
        }
        if (contract.disputeManagerAddress) {
            listenToDisputeManagerEvents(contract);
        }

        console.log(`✅ Event listeners added for contract ${contractId}`);
    } catch (error) {
        console.error('❌ Error adding contract listener:', error);
    }
};

module.exports = {
    startEventListeners,
    addContractListener
};
