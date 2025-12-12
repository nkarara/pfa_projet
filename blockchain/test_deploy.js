const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

const compileAndDeploy = async () => {
    console.log('🔨 Compiling TestContract...');

    // Compile
    exec('npx solc --bin --abi ../blockchain/contracts/TestContract.sol -o ../blockchain/build/raw --overwrite', { cwd: __dirname }, async (error, stdout, stderr) => {
        if (error) {
            console.error('Compilation failed:', stderr);
            return;
        }

        try {
            const abi = JSON.parse(fs.readFileSync(path.join(__dirname, '../blockchain/build/raw/TestContract.abi'), 'utf8'));
            const bytecode = '0x' + fs.readFileSync(path.join(__dirname, '../blockchain/build/raw/TestContract.bin'), 'utf8');

            console.log('🚀 Deploying TestContract...');

            const accounts = await web3.eth.getAccounts();
            const deployer = accounts[0]; // Use first account
            console.log('Deployer:', deployer);

            const contract = new web3.eth.Contract(abi);

            const deployTx = contract.deploy({
                data: bytecode,
                arguments: [123]
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
            console.error('❌ Deployment failed:', e);
        }
    });
};

compileAndDeploy();
