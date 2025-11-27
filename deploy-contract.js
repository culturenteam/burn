/**
 * Smart Contract Deployment Script
 * 
 * This script deploys the Burn Rewarder contract to Tezos mainnet
 * 
 * Usage:
 * 1. Set your private key: export PRIVATE_KEY="edsk..."
 * 2. Run: node deploy-contract.js
 */

const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');
const fs = require('fs');

// Configuration
const RPC_URL = 'https://mainnet.ecadinfra.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Contract code
const contractCode = fs.readFileSync('./contracts/burn_rewarder_final.tz', 'utf8');

// Initial storage
const initialStorage = {
  admin: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  true_vision_contract: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
  true_vision_token_id: 754916,
  burn_address: 'tz1burnburnburnburnburnburnburjAYjjX',
  paused: false
};

async function deployContract() {
  console.log('🚀 Starting contract deployment...\n');
  
  // Validate private key
  if (!PRIVATE_KEY) {
    console.error('❌ Error: PRIVATE_KEY environment variable not set');
    console.error('   Set it with: export PRIVATE_KEY="edsk..."');
    process.exit(1);
  }
  
  try {
    // Initialize Tezos
    console.log('📡 Connecting to Tezos mainnet...');
    const tezos = new TezosToolkit(RPC_URL);
    
    // Set up signer
    tezos.setProvider({
      signer: await InMemorySigner.fromSecretKey(PRIVATE_KEY)
    });
    
    const address = await tezos.signer.publicKeyHash();
    console.log(`✅ Connected with address: ${address}\n`);
    
    // Check balance
    const balance = await tezos.tz.getBalance(address);
    console.log(`💰 Balance: ${balance.toNumber() / 1000000} XTZ`);
    
    if (balance.toNumber() < 1000000) {
      console.error('❌ Error: Insufficient balance (need at least 1 XTZ for deployment)');
      process.exit(1);
    }
    
    console.log('\n📝 Contract configuration:');
    console.log(`   Admin: ${initialStorage.admin}`);
    console.log(`   True Vision Contract: ${initialStorage.true_vision_contract}`);
    console.log(`   True Vision Token ID: ${initialStorage.true_vision_token_id}`);
    console.log(`   Burn Address: ${initialStorage.burn_address}`);
    console.log(`   Paused: ${initialStorage.paused}`);
    
    console.log('\n🔨 Deploying contract...');
    console.log('   (This may take 1-2 minutes)');
    
    // Deploy contract
    const origination = await tezos.contract.originate({
      code: contractCode,
      storage: initialStorage
    });
    
    console.log(`\n✅ Contract deployment initiated!`);
    console.log(`   Operation hash: ${origination.hash}`);
    console.log(`   Waiting for confirmation...`);
    
    // Wait for confirmation
    await origination.confirmation(1);
    
    const contractAddress = origination.contractAddress;
    
    console.log('\n🎉 CONTRACT DEPLOYED SUCCESSFULLY!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🔗 View on TzKT:');
    console.log(`   https://tzkt.io/${contractAddress}\n`);
    
    console.log('📋 Next Steps:\n');
    console.log('1. Fund the contract with True Vision tokens:');
    console.log(`   Send True Vision to: ${contractAddress}\n`);
    console.log('2. Update your dApp configuration:');
    console.log(`   export const BURN_REWARDER_CONTRACT = '${contractAddress}';\n`);
    console.log('3. Test the contract with a small burn first!\n');
    
    // Save contract address to file
    fs.writeFileSync('CONTRACT_ADDRESS.txt', contractAddress);
    console.log('✅ Contract address saved to CONTRACT_ADDRESS.txt\n');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    
    if (error.message.includes('balance_too_low')) {
      console.error('   → Insufficient XTZ balance');
    } else if (error.message.includes('counter')) {
      console.error('   → Try again in a few seconds');
    } else {
      console.error('   → Full error:', error);
    }
    
    process.exit(1);
  }
}

// Run deployment
deployContract();
