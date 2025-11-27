/**
 * Burn Service
 * Handles NFT burning transactions and True Vision rewards
 */

import { TezosToolkit } from '@taquito/taquito';
import { BURN_ADDRESS, TRUE_VISION, CREATOR_ADDRESS, BURN_REWARDER_CONTRACT } from '../constants';
import { NFT } from '../types';

/**
 * Burn NFT and receive True Vision tokens
 * If BURN_REWARDER_CONTRACT is set, uses automatic distribution via smart contract
 * Otherwise, burns NFT only (manual reward distribution)
 * @param tezos - TezosToolkit instance
 * @param userAddress - User's Tezos address
 * @param nft - NFT to burn
 * @param amount - Number of editions to burn
 * @returns Transaction hash
 */
export const burnNFT = async (
  tezos: TezosToolkit,
  userAddress: string,
  nft: NFT,
  amount: number
): Promise<string> => {
  try {
    console.log('🔥 Starting burn transaction...');
    console.log('NFT:', nft.name, `(${nft.contractAddress})`);
    console.log('Token ID:', nft.tokenId);
    console.log('Amount:', amount);

    // Calculate True Vision reward
    const trueVisionRewardAmount = nft.trueVisionReward 
      ? Math.floor(nft.trueVisionReward * amount)
      : 0;

    console.log('💎 True Vision reward:', trueVisionRewardAmount, 'TV');

    // Check if we have a burn rewarder contract for automatic distribution
    if (BURN_REWARDER_CONTRACT) {
      console.log('🤖 Using automatic reward distribution via contract');
      return await burnWithContract(tezos, userAddress, nft, amount, trueVisionRewardAmount);
    } else {
      console.log('👤 Using manual reward distribution');
      return await burnManual(tezos, userAddress, nft, amount, trueVisionRewardAmount);
    }
  } catch (error: any) {
    console.error('❌ Burn transaction failed:', error);
    
    // Provide user-friendly error messages
    if (error?.message?.includes('User rejected')) {
      throw new Error('Transaction was rejected in your wallet');
    } else if (error?.message?.includes('insufficient')) {
      throw new Error('Insufficient XTZ for transaction fees');
    } else if (error?.message?.includes('FA2_INSUFFICIENT_BALANCE')) {
      throw new Error('Insufficient NFT balance');
    } else if (error?.message?.includes('FA2_NOT_OPERATOR')) {
      throw new Error('Automatic rewards not set up. Contact brutalisti.');
    } else if (error?.message?.includes('FA2_TOKEN_UNDEFINED')) {
      throw new Error('True Vision token not found. Please contact brutalisti.');
    } else {
      throw new Error(error?.message || 'Failed to burn NFT. Please try again.');
    }
  }
};

/**
 * Burn via smart contract (automatic True Vision distribution)
 */
const burnWithContract = async (
  tezos: TezosToolkit,
  userAddress: string,
  nft: NFT,
  amount: number,
  reward: number
): Promise<string> => {
  console.log('📝 Step 1: Burning NFT to:', BURN_ADDRESS);
  
  // First: Burn the NFT
  const nftContract = await tezos.wallet.at(nft.contractAddress);
  
  const burnTransferParams = [
    {
      from_: userAddress,
      txs: [
        {
          to_: BURN_ADDRESS,
          token_id: parseInt(nft.tokenId, 10),
          amount: amount,
        },
      ],
    },
  ];
  
  const burnOp = await Promise.race([
    nftContract.methods.transfer(burnTransferParams).send(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Wallet approval timeout')), 120000)
    )
  ]);
  
  console.log('✅ Burn transaction sent:', burnOp.opHash);
  
  try {
    await Promise.race([
      burnOp.confirmation(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Confirmation timeout')), 60000))
    ]);
    console.log('✅ Burn confirmed!');
  } catch (confirmError) {
    console.log('⚠️ Confirmation timeout, but burn was sent');
  }
  
  // Second: Call reward contract to send True Vision
  if (reward > 0) {
    console.log('📝 Step 2: Calling reward contract:', BURN_REWARDER_CONTRACT);
    
    const rewardContract = await tezos.wallet.at(BURN_REWARDER_CONTRACT!);
    
    const rewardOp = await rewardContract.methods.send_reward(
      reward,      // amount (editions)
      userAddress  // recipient
    ).send();
    
    console.log('✅ Reward transaction sent:', rewardOp.opHash);
    
    try {
      await rewardOp.confirmation(1);
      console.log('💎 True Vision reward delivered!');
    } catch (confirmError) {
      console.log('⚠️ Reward confirmation timeout, but transaction was sent');
    }
  }
  
  return burnOp.opHash;
};

/**
 * Burn manually (NFT only, rewards distributed separately)
 */
const burnManual = async (
  tezos: TezosToolkit,
  userAddress: string,
  nft: NFT,
  amount: number,
  reward: number
): Promise<string> => {
  console.log('📝 Burning NFT to:', BURN_ADDRESS);
  console.log('💎 Reward:', reward, 'TV');
  
  const nftContract = await tezos.wallet.at(nft.contractAddress);
  
  const burnTransferParams = [
    {
      from_: userAddress,
      txs: [
        {
          to_: BURN_ADDRESS,
          token_id: parseInt(nft.tokenId, 10),
          amount: amount,
        },
      ],
    },
  ];
  
  const operation = await Promise.race([
    nftContract.methods.transfer(burnTransferParams).send(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Wallet approval timeout')), 120000)
    )
  ]);
  
  console.log('✅ Burn transaction sent!');
  console.log('Operation hash:', operation.opHash);
  
  try {
    await Promise.race([
      operation.confirmation(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Confirmation timeout')), 60000))
    ]);
    console.log('✅ Burn confirmed!');
    
    // If creator is connected, send reward immediately
    const connectedAddress = await tezos.wallet.pkh();
    if (connectedAddress === CREATOR_ADDRESS && reward > 0) {
      console.log('💎 Creator connected - sending True Vision reward...');
      await sendTrueVisionReward(tezos, userAddress, reward);
    } else {
      console.log('💎 True Vision reward of', reward, 'TV will be sent by creator');
    }
  } catch (confirmError) {
    console.log('⚠️ Confirmation timeout, but transaction was sent');
  }
  
  return operation.opHash;
};

/**
 * Send True Vision reward (creator only)
 */
const sendTrueVisionReward = async (
  tezos: TezosToolkit,
  recipient: string,
  amount: number
): Promise<void> => {
  try {
    const tvContract = await tezos.wallet.at(TRUE_VISION.contractAddress);
    
    const operation = await tvContract.methods.transfer([{
      from_: CREATOR_ADDRESS,
      txs: [{
        to_: recipient,
        token_id: TRUE_VISION.tokenId,
        amount: amount
      }]
    }]).send();
    
    console.log('💎 True Vision transfer sent:', operation.opHash);
    await operation.confirmation(1);
    console.log('✅ True Vision reward delivered!');
  } catch (error) {
    console.error('❌ Failed to send True Vision reward:', error);
    throw new Error('Burn succeeded but reward failed. Please send manually.');
  }
};

/**
 * Estimate gas cost for burn transaction
 * @param tezos - TezosToolkit instance
 * @param userAddress - User's Tezos address
 * @param nft - NFT to burn
 * @param amount - Number of editions to burn
 * @returns Estimated cost in XTZ
 */
export const estimateBurnCost = async (
  tezos: TezosToolkit,
  userAddress: string,
  nft: NFT,
  amount: number
): Promise<number> => {
  try {
    // Return a default estimate
    // Actual estimation would require complex type handling
    return 0.01; // ~0.01 XTZ default estimate
  } catch (error) {
    console.error('Failed to estimate cost:', error);
    return 0.01;
  }
};
