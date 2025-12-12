const { Web3 } = require('web3');
require('dotenv').config();

// Initialize Web3
const web3 = new Web3(process.env.BLOCKCHAIN_RPC || 'http://127.0.0.1:7545');

// Contract ABIs (will be updated after compilation)
let RentalContractABI, PaymentManagerABI, DisputeManagerABI;
let RentalContractBytecode, PaymentManagerBytecode, DisputeManagerBytecode;

try {
    const RentalContractJSON = require('../../../blockchain/build/contracts/RentalContract.json');
    const PaymentManagerJSON = require('../../../blockchain/build/contracts/PaymentManager.json');
    const DisputeManagerJSON = require('../../../blockchain/build/contracts/DisputeManager.json');

    RentalContractABI = RentalContractJSON.abi;
    PaymentManagerABI = PaymentManagerJSON.abi;
    DisputeManagerABI = DisputeManagerJSON.abi;

    RentalContractBytecode = RentalContractJSON.bytecode;
    PaymentManagerBytecode = PaymentManagerJSON.bytecode;
    DisputeManagerBytecode = DisputeManagerJSON.bytecode;

    console.log('✅ Smart contracts loaded successfully');
} catch (error) {
    console.warn('⚠️  Smart contracts not compiled yet. Blockchain features will be disabled.');
    console.warn('   Run: cd blockchain && npx truffle compile');
    RentalContractABI = [];
    PaymentManagerABI = [];
    DisputeManagerABI = [];
}

/**
 * Get contract instance
 */
const getContractInstance = (abi, address) => {
    return new web3.eth.Contract(abi, address);
};

/**
 * Deploy RentalContract
 */
const deployRentalContract = async (landlordAddress, params) => {
    try {
        if (!RentalContractBytecode || RentalContractBytecode === '0x') {
            console.warn('⚠️  Cannot deploy RentalContract: Bytecode is missing.');
            throw new Error('Contract bytecode is missing. Please compile contracts.');
        }

        const { tenant, rentAmount, depositAmount, durationMonths, propertyAddress, terms } = params;

        const RentalContract = new web3.eth.Contract(RentalContractABI);

        const deployTx = RentalContract.deploy({
            data: RentalContractBytecode,
            arguments: [
                tenant,
                web3.utils.toWei(rentAmount.toString(), 'ether'),
                web3.utils.toWei(depositAmount.toString(), 'ether'),
                durationMonths,
                propertyAddress,
                terms
            ]
        });

        const gas = await deployTx.estimateGas({ from: landlordAddress });

        const contract = await deployTx.send({
            from: landlordAddress,
            gas: 6000000 // Hardcoded high gas limit
        });

        return contract.options.address;
    } catch (error) {
        console.error('Error deploying RentalContract:', error);
        throw error;
    }
};

/**
 * Deploy PaymentManager
 */
const deployPaymentManager = async (landlordAddress, params) => {
    try {
        if (!PaymentManagerBytecode || PaymentManagerBytecode === '0x') {
            throw new Error('PaymentManager bytecode is missing.');
        }

        const { tenant, rentAmount, startDate, durationMonths, penaltyRate, gracePeriodDays } = params;

        const PaymentManager = new web3.eth.Contract(PaymentManagerABI);

        const deployTx = PaymentManager.deploy({
            data: require('../../../blockchain/build/contracts/PaymentManager.json').bytecode,
            arguments: [
                tenant,
                web3.utils.toWei(rentAmount.toString(), 'ether'),
                Math.floor(startDate / 1000), // Convert to Unix timestamp
                durationMonths,
                penaltyRate || 5,
                gracePeriodDays || 3
            ]
        });

        const gas = await deployTx.estimateGas({ from: landlordAddress });

        const contract = await deployTx.send({
            from: landlordAddress,
            gas: 6000000
        });

        return contract.options.address;
    } catch (error) {
        console.error('Error deploying PaymentManager:', error);
        throw error;
    }
};

/**
 * Deploy DisputeManager
 */
const deployDisputeManager = async (landlordAddress, tenantAddress) => {
    try {
        if (!DisputeManagerBytecode || DisputeManagerBytecode === '0x') {
            throw new Error('DisputeManager bytecode is missing.');
        }

        const DisputeManager = new web3.eth.Contract(DisputeManagerABI);

        const deployTx = DisputeManager.deploy({
            data: require('../../../blockchain/build/contracts/DisputeManager.json').bytecode,
            arguments: [
                tenantAddress,
                '0x0000000000000000000000000000000000000000' // No arbitrator
            ]
        });

        const gas = await deployTx.estimateGas({ from: landlordAddress });

        const contract = await deployTx.send({
            from: landlordAddress,
            gas: 6000000
        });

        return contract.options.address;
    } catch (error) {
        console.error('Error deploying DisputeManager:', error);
        throw error;
    }
};

/**
 * Listen to contract events
 */
const listenToContractEvents = (contractAddress, abi, eventName, callback) => {
    const contract = new web3.eth.Contract(abi, contractAddress);

    contract.events[eventName]()
        .on('data', callback)
        .on('error', (error) => {
            console.error(`Error listening to ${eventName}:`, error);
        });
};

/**
 * Get transaction receipt
 */
const getTransactionReceipt = async (txHash) => {
    return await web3.eth.getTransactionReceipt(txHash);
};

/**
 * Convert Wei to Ether
 */
const weiToEth = (wei) => {
    return web3.utils.fromWei(wei.toString(), 'ether');
};

/**
 * Convert Ether to Wei
 */
const ethToWei = (eth) => {
    return web3.utils.toWei(eth.toString(), 'ether');
};

module.exports = {
    web3,
    getContractInstance,
    deployRentalContract,
    deployPaymentManager,
    deployDisputeManager,
    listenToContractEvents,
    getTransactionReceipt,
    weiToEth,
    ethToWei,
    RentalContractABI,
    PaymentManagerABI,
    DisputeManagerABI
};
