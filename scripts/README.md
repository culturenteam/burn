# Scripts Directory

## Burn Rewarder Smart Contract

### deploy-burn-rewarder.py

SmartPy contract for automated True Vision reward distribution.

**Features:**
- Burns NFTs and sends True Vision rewards in one transaction
- Admin controls (pause, withdraw, update admin)
- Secure and auditable
- Gas efficient

**Usage:**

```bash
# Install SmartPy
pip install smartpy

# Compile contract
smartpy compile deploy-burn-rewarder.py output/

# Test contract
smartpy test deploy-burn-rewarder.py output/

# Deploy using Better Call Dev or Temple Wallet
# Use the compiled Michelson code from output/BurnRewarder/step_000_cont_0_contract.tz
```

**Initial Storage:**

```json
{
  "admin": "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva",
  "true_vision_contract": "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
  "true_vision_token_id": 754916,
  "burn_address": "tz1burnburnburnburnburnburnburjAYjjX",
  "paused": false
}
```

**After Deployment:**

1. Fund contract with True Vision tokens
2. Update `constants/index.ts` with contract address
3. Test on Ghostnet
4. Deploy to mainnet

See [AUTOMATED_REWARDS_GUIDE.md](../AUTOMATED_REWARDS_GUIDE.md) for complete instructions.

## Development Scripts

### dev.sh

Alternative development server script.

```bash
./scripts/dev.sh
```

Starts Vite dev server on port 3000.
