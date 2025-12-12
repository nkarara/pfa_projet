const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build', 'contracts');
const rawDir = path.join(__dirname, 'build', 'raw');

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

console.log('🚀 Processing artifacts...');

const contracts = ['RentalContract', 'PaymentManager', 'DisputeManager'];

contracts.forEach(name => {
    try {
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
            console.log(`   - Generated ${name}.json`);
        } else {
            console.warn(`⚠️  Missing artifacts for ${name}`);
        }
    } catch (e) {
        console.error(`❌ Error processing ${name}:`, e.message);
    }
});

console.log('🎉 Artifact processing complete!');
