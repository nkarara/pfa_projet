const fs = require('fs');
const path = require('path');
const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

const deployRentalContract = async () => {
    try {
        console.log('🚀 Loading RentalContract...');
        const artifactPath = path.join(__dirname, '../blockchain/build/contracts/RentalContract.json');

        if (!fs.existsSync(artifactPath)) {
            console.error('❌ Artifact not found:', artifactPath);
            return;
        }

        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        const abi = artifact.abi;
        const bytecode = artifact.bytecode;

        console.log('✅ Contract loaded.');

        const accounts = await web3.eth.getAccounts();
        console.log('Available Accounts:', accounts);

        // Try to use the landlord address if available, otherwise use the first account
        const landlord = '0x196D5069Eb22daDF202d0aF5837f4210AEbAF1d6';
        let deployer = accounts.find(a => a.toLowerCase() === landlord.toLowerCase());

        if (!deployer) {
            console.warn(`⚠️ Landlord address ${landlord} not found in Ganache accounts.`);
            console.warn('   Using first available account instead.');
            deployer = accounts[0];
        }

        console.log('Deployer:', deployer);
        const balance = await web3.eth.getBalance(deployer);
        console.log('Deployer Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

        const contract = new web3.eth.Contract(abi);

        console.log('Attempting deployment with params:');
        console.log('Tenant:', '0xDd644C8650401181352Dba2ff49EF7A0359CB433');
        console.log('Rent:', web3.utils.toWei('0.1', 'ether'));
        console.log('Deposit:', web3.utils.toWei('0.098', 'ether'));
        console.log('Duration:', 12);
        console.log('Property:', '123');
        console.log('Terms:', 'Terms');

        const deployTx = contract.deploy({
            data: bytecode,
            arguments: [
                '0xDd644C8650401181352Dba2ff49EF7A0359CB433', // Tenant
                web3.utils.toWei('0.1', 'ether'), // Rent
                web3.utils.toWei('0.098', 'ether'), // Deposit
                12, // Duration
                '123', // Property
                'Terms' // Terms
            ]
        });

        const gas = await deployTx.estimateGas({ from: deployer });
        console.log('Estimated Gas:', gas);

        const instance = await deployTx.send({
            from: deployer,
            gas: 6000000
        });

        console.log('✅ Deployment Successful!');
        console.log('Address:', instance.options.address);

    } catch (e) {
        console.error('❌ Deployment failed:', JSON.stringify(e, null, 2));
    }
};

deployRentalContract();
