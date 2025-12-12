const RentalContract = artifacts.require("RentalContract");
const PaymentManager = artifacts.require("PaymentManager");
const DisputeManager = artifacts.require("DisputeManager");

module.exports = function (deployer, network, accounts) {
    const landlord = accounts[0];
    const tenant = accounts[1];

    // Contract parameters
    const rentAmount = web3.utils.toWei('1', 'ether'); // 1 ETH per month
    const depositAmount = web3.utils.toWei('2', 'ether'); // 2 ETH deposit
    const durationMonths = 12; // 1 year contract
    const propertyAddress = "123 Blockchain Street, Web3 City";
    const terms = "Standard rental agreement terms and conditions";
    const penaltyRate = 5; // 5% penalty rate
    const gracePeriodDays = 3; // 3 days grace period

    // Deploy RentalContract
    deployer.deploy(
        RentalContract,
        tenant,
        rentAmount,
        depositAmount,
        durationMonths,
        propertyAddress,
        terms,
        { from: landlord }
    );

    // Deploy PaymentManager
    deployer.deploy(
        PaymentManager,
        tenant,
        rentAmount,
        Math.floor(Date.now() / 1000), // Contract start date (now)
        durationMonths,
        penaltyRate,
        gracePeriodDays,
        { from: landlord }
    );

    // Deploy DisputeManager
    deployer.deploy(
        DisputeManager,
        tenant,
        "0x0000000000000000000000000000000000000000", // No arbitrator initially
        { from: landlord }
    );
};
