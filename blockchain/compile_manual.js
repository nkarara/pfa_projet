const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const buildDir = path.join(__dirname, 'build', 'contracts');
const rawDir = path.join(__dirname, 'build', 'raw');
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

console.log('🚀 Starting manual compilation...');

// Compile all contracts
const command = 'npx solcjs --bin --abi contracts/RentalContract.sol contracts/PaymentManager.sol contracts/DisputeManager.sol -o build/raw';

exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Compilation failed:', error);
        console.error('Stderr:', stderr);
        return;
    }

    console.log('✅ Solc compilation successful. Processing artifacts...');

    const contracts = ['RentalContract', 'PaymentManager', 'DisputeManager'];

    contracts.forEach(name => {
        try {
            // Find files ending with Name.abi and Name.bin
            const files = fs.readdirSync(rawDir);
            const abiFile = files.find(f => f.includes(name) && f.endsWith('.abi'));
            const binFile = files.find(f => f.includes(name) && f.endsWith('.bin'));

            if (abiFile && binFile) {
                console.log(`   Found artifacts for ${name}: ABI=${abiFile}, BIN=${binFile}`);
                const abiPath = path.join(rawDir, abiFile);
                const binPath = path.join(rawDir, binFile);

                const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                const binContent = fs.readFileSync(binPath, 'utf8');
                console.log(`   BIN content length: ${binContent.length}`);
                const bytecode = '0x' + binContent;

                const artifact = {
                    contractName: name,
                    abi: abi,
                    bytecode: bytecode,
                    networks: {}
                };

                fs.writeFileSync(
                    path.join(buildDir, `${name}.json`),
                    JSON.stringify(artifact, null, 2)
                );
                console.log(`   - Generated ${name}.json from ${abiFile}`);
            } else {
                console.warn(`⚠️  Missing artifacts for ${name}`);
            }
        } catch (e) {
            console.error(`❌ Error processing ${name}:`, e.message);
        }
    });

    console.log('🎉 Compilation complete!');
});
