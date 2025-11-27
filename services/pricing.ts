/**
 * True Vision Pricing Service
 * Calculates dynamic burn rewards based on last sale price, time decay, and edition count
 */

export interface PricingConfig {
  baseRewardPercentage: number; // 80% of last sale price
  monthlyDecayPercentage: number; // 10% per month
  editionPenaltyThreshold: number; // 10 editions
  editionPenaltyStep: number; // 10 editions
  editionPenaltyPercentage: number; // 5% per step
  minimumReward: number; // Minimum True Vision tokens (equivalent to ~1.20 tez)
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  baseRewardPercentage: 0.8, // 80%
  monthlyDecayPercentage: 0.1, // 10%
  editionPenaltyThreshold: 10,
  editionPenaltyStep: 10,
  editionPenaltyPercentage: 0.05, // 5%
  minimumReward: 1, // 1 True Vision token minimum
};

export interface PricingFactors {
  baseReward: number;
  timeDecayFactor: number;
  editionPenaltyFactor: number;
  finalReward: number;
  monthsSinceLastSale: number;
  editionPenaltySteps: number;
}

/**
 * Calculate months elapsed since a date
 */
export function calculateMonthsElapsed(lastSaleDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastSaleDate.getTime());
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Average days per month
  return Math.floor(diffMonths);
}

/**
 * Calculate time decay factor
 * Each month reduces the reward by 10%
 */
export function calculateTimeDecayFactor(
  monthsElapsed: number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): number {
  const decayFactor = Math.pow(1 - config.monthlyDecayPercentage, monthsElapsed);
  return Math.max(decayFactor, 0.1); // Never go below 10% of base
}

/**
 * Calculate edition penalty factor
 * For each 10 editions above 10, reduce by 5%
 */
export function calculateEditionPenaltyFactor(
  totalEditions: number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): number {
  if (totalEditions <= config.editionPenaltyThreshold) {
    return 1.0; // No penalty
  }

  const excessEditions = totalEditions - config.editionPenaltyThreshold;
  const penaltySteps = Math.floor(excessEditions / config.editionPenaltyStep);
  const penaltyFactor = Math.pow(1 - config.editionPenaltyPercentage, penaltySteps);
  
  return Math.max(penaltyFactor, 0.1); // Never go below 10% of base
}

/**
 * Calculate True Vision reward for burning an NFT
 * 
 * @param lastSalePriceTez - Last sale price in tez
 * @param lastSaleDate - Date of last sale
 * @param totalEditions - Total number of editions
 * @param config - Pricing configuration
 * @returns Pricing factors and final reward
 */
export function calculateTrueVisionReward(
  lastSalePriceTez: number,
  lastSaleDate: Date,
  totalEditions: number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PricingFactors {
  // Base reward: 80% of last sale price
  const baseReward = lastSalePriceTez * config.baseRewardPercentage;

  // Calculate time decay
  const monthsElapsed = calculateMonthsElapsed(lastSaleDate);
  const timeDecayFactor = calculateTimeDecayFactor(monthsElapsed, config);

  // Calculate edition penalty
  const editionPenaltySteps = Math.max(
    0,
    Math.floor((totalEditions - config.editionPenaltyThreshold) / config.editionPenaltyStep)
  );
  const editionPenaltyFactor = calculateEditionPenaltyFactor(totalEditions, config);

  // Calculate final reward
  let finalReward = baseReward * timeDecayFactor * editionPenaltyFactor;

  // Apply minimum reward
  finalReward = Math.max(finalReward, config.minimumReward);

  return {
    baseReward,
    timeDecayFactor,
    editionPenaltyFactor,
    finalReward,
    monthsSinceLastSale: monthsElapsed,
    editionPenaltySteps,
  };
}

/**
 * Format True Vision reward for display
 */
export function formatTrueVisionReward(reward: number): string {
  return reward.toFixed(2);
}

/**
 * Get pricing explanation for UI
 */
export function getPricingExplanation(factors: PricingFactors): string {
  const parts: string[] = [];

  if (factors.monthsSinceLastSale > 0) {
    parts.push(`${factors.monthsSinceLastSale} month${factors.monthsSinceLastSale > 1 ? 's' : ''} decay`);
  }

  if (factors.editionPenaltySteps > 0) {
    parts.push(`high edition count`);
  }

  if (parts.length === 0) {
    return 'Recent sale, standard editions';
  }

  return parts.join(', ');
}
