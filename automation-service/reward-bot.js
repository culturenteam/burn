/**
 * Automated True Vision Reward Distribution Service
 * 
 * This service monitors NFT burns and automatically sends True Vision rewards.
 * No smart contract needed - just run this on your computer or a server.
 * 
 * Setup:
 * 1. npm install @taquito/taquito @taquito/signer axios
 * 2. Set your private key in .env file
 * 3. Run: node reward-bot.js
 */

const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');
const axios = require('axios');
require('dotenv').config();

// Configuration
const CONFIG = {
  RPC_URL: 'https://mainnet.ecadinfra.com',
  PRIVATE_KEY: process.env.REWARD_WALLET_PRIVATE_KEY, // Your wallet private key
  TRUE_VISION_CONTRACT: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
  TRUE_VISION_TOKEN_ID: 754916,
  BURN_ADDRESS: 'tz1burnburnburnburnburnburnburjAYjjX',
  CHECK_INTERVAL: 30000, // Check every 30 seconds
  CREATOR_ADDRESS: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva', // Your address
};

// Initialize Tezos
const tezos = new TezosToolkit(CONFIG.RPC_URL);

// Track processed burns to avoid duplicates
const processedBurns = new Set();

/**
 * Calculate True Vision reward based on NFT metadata
 */
function calculateReward(nft) {
  // Your pricing logic here
  // For now, return a fixed amount
  return 1000000; // 1 True Vision (with 6 decimals)
}

/**
 * Send True Vision tokens to an address
 */
async function sendTrueVision(toAddress, amount) {
  try {
    console.log(`💎 Sending ${amount / 1000000} True Vision to ${toAddress}...`);
    
    const contract = await tezos.wallet.at(CONFIG.TRUE_VISION_CONTRACT);
    
    const op = await contract.methods.transfer([{
      from_: await tezos.signer.publicKeyHash(),
      txs: [{
        to_: toAddress,
        token_id: CONFIG.TRUE_VISION_TOKEN_ID,
        amount: amount
      }]
    }]).send();
    
    console.log(`✅ Transaction sent: ${op.opHash}`);
    await op.confirmation();
    console.log(`✅ Confirmed!`);
    
    return op.opHash;
  } catch (error) {
    console.error(`❌ Failed to send True Vision:`, error.message);
    throw error;
  }
}

/**
 * Check for new burns and process rewards
 */
async function checkForBurns() {
  try {
    // Get recent transfers to burn address
    const response = await axios.get(
      `https://api.tzkt.io/v1/tokens/transfers`,
      {
        params: {
          to: CONFIG.BURN_ADDRESS,
          'sort.desc': 'timestamp',
          limit: 20
        }
      }
    );
    
    for (const transfer of response.data) {
      const burnId = `${transfer.transactionId}-${transfer.from.address}`;
      
      // Skip if already processed
      if (processedBurns.has(burnId)) continue;
      
      // Skip if not from your NFTs (optional filter)
      // if (transfer.token.contract.creator?.address !== CONFIG.CREATOR_ADDRESS) continue;
      
      console.log(`\n🔥 New burn detected!`);
      console.log(`  From: ${transfer.from.address}`);
      console.log(`  NFT: ${transfer.token.metadata?.name || 'Unknown'}`);
      console.log(`  Amount: ${transfer.amount}`);
      
      // Calculate reward
      const rewardAmount = calculateReward(transfer.token);
      
      if (rewardAmount > 0) {
        try {
          // Send reward
          await sendTrueVision(transfer.from.address, rewardAmount);
          
          // Mark as processed
          processedBurns.add(burnId);
          
          console.log(`✅ Reward sent successfully!\n`);
        } catch (error) {
          console.error(`❌ Failed to process burn ${burnId}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error checking for burns:`, error.message);
  }
}

/**
 * Start the reward bot
 */
async function start() {
  console.log('🤖 True Vision Reward Bot Starting...\n');
  
  // Validate configuration
  if (!CONFIG.PRIVATE_KEY) {
    console.error('❌ Error: REWARD_WALLET_PRIVATE_KEY not set in .env file');
    process.exit(1);
  }
  
  // Set up signer
  try {
    tezos.setProvider({
      signer: await InMemorySigner.fromSecretKey(CONFIG.PRIVATE_KEY)
    });
    
    const address = await tezos.signer.publicKeyHash();
    console.log(`✅ Wallet connected: ${address}`);
    console.log(`✅ Monitoring burns to: ${CONFIG.BURN_ADDRESS}`);
    console.log(`✅ Checking every ${CONFIG.CHECK_INTERVAL / 1000} seconds\n`);
  } catch (error) {
    console.error('❌ Error setting up wallet:', error.message);
    process.exit(1);
  }
  
  // Start monitoring
  setInterval(checkForBurns, CONFIG.CHECK_INTERVAL);
  
  // Check immediately on start
  checkForBurns();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down reward bot...');
  process.exit(0);
});

// Start the bot
start();
