import { mnemonicToAccount } from 'viem/accounts';

const mnemonic = process.argv[2];
if (!mnemonic) {
    console.error('Please provide your mnemonic phrase as an argument');
    process.exit(1);
}

try {
    const account = mnemonicToAccount(mnemonic);
    console.log('\nPrivate Key:', account.privateKey);
    console.log('Address:', account.address);
} catch (error) {
    console.error('Error:', error.message);
} 