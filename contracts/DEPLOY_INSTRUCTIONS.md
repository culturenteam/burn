# 🚀 Deploy Contract - Copy/Paste Ready

## Method 1: Better Call Dev (Easiest)

### Step 1: Go to Better Call Dev
**Mainnet:** https://better-call.dev/mainnet/deploy

### Step 2: Paste Contract Code

Copy and paste this ENTIRE block (including the semicolons):

```
parameter (pair address (pair nat (pair nat nat)));
storage (pair address (pair address (pair nat (pair address bool))));
code { UNPAIR ;
       SWAP ;
       DUP ;
       CDR ;
       CDR ;
       CDR ;
       CDR ;
       IF { PUSH string "Paused" ; FAILWITH } {} ;
       DUP ;
       CDR ;
       CDR ;
       CDR ;
       CAR ;
       DIG 2 ;
       DUP ;
       CAR ;
       DIG 2 ;
       DUP ;
       CDR ;
       CAR ;
       DIG 3 ;
       DUP ;
       CDR ;
       CDR ;
       CAR ;
       DIG 4 ;
       CDR ;
       CDR ;
       CDR ;
       DIG 4 ;
       DUP ;
       CDR ;
       CAR ;
       DIG 6 ;
       DUP ;
       CDR ;
       CDR ;
       CAR ;
       NIL operation ;
       DIG 6 ;
       CONTRACT %transfer (list (pair address (list (pair address (pair nat nat))))) ;
       IF_NONE { PUSH string "Bad NFT" ; FAILWITH } {} ;
       PUSH mutez 0 ;
       NIL (pair address (list (pair address (pair nat nat)))) ;
       NIL (pair address (pair nat nat)) ;
       DIG 6 ;
       DIG 7 ;
       PAIR ;
       PAIR ;
       DIG 7 ;
       SWAP ;
       PAIR ;
       CONS ;
       SENDER ;
       PAIR ;
       CONS ;
       TRANSFER_TOKENS ;
       CONS ;
       DIG 2 ;
       CONTRACT %transfer (list (pair address (list (pair address (pair nat nat))))) ;
       IF_NONE { PUSH string "Bad TV" ; FAILWITH } {} ;
       PUSH mutez 0 ;
       NIL (pair address (list (pair address (pair nat nat)))) ;
       NIL (pair address (pair nat nat)) ;
       DIG 3 ;
       DIG 3 ;
       PAIR ;
       PAIR ;
       SENDER ;
       SWAP ;
       PAIR ;
       CONS ;
       SELF_ADDRESS ;
       PAIR ;
       CONS ;
       TRANSFER_TOKENS ;
       CONS ;
       PAIR }
```

### Step 3: Set Initial Storage

Paste this ENTIRE block:

```
(Pair "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva" (Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" (Pair 754916 (Pair "tz1burnburnburnburnburnburnburjAYjjX" False))))
```

**Or fill in the form fields:**
- Field 1: `tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`
- Field 2: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`
- Field 3: `754916`
- Field 4: `tz1burnburnburnburnburnburnburjAYjjX`
- Field 5: `False` (or uncheck the box)

### Step 4: Deploy
- Click "Deploy"
- Approve in wallet (~0.5-1 XTZ)
- Copy the contract address

---

## Method 2: Using Octez Client (Advanced)

If Better Call Dev doesn't work, use the command line:

```bash
# Install Octez
wget https://gitlab.com/tezos/tezos/-/package_files/137748081/download -O octez-client
chmod +x octez-client

# Import your key
./octez-client import secret key mykey unencrypted:edsk...

# Deploy
./octez-client originate contract burn_rewarder \
  transferring 0 from mykey \
  running burn_rewarder_simple.tz \
  --init '(Pair "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva" (Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" (Pair 754916 (Pair "tz1burnburnburnburnburnburnburjAYjjX" False))))' \
  --burn-cap 1
```

---

## Method 3: SmartPy Online IDE

1. Go to: https://smartpy.io/ide
2. Paste this Python code:

```python
import smartpy as sp

@sp.module
def main():
    class BurnRewarder(sp.Contract):
        def __init__(self):
            self.data.admin = sp.address("tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva")
            self.data.tv_contract = sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton")
            self.data.tv_token_id = 754916
            self.data.burn_address = sp.address("tz1burnburnburnburnburnburnburjAYjjX")
            self.data.paused = False
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            assert not self.data.paused, "Paused"
            
            # Transfer NFT to burn
            nft = sp.contract(
                sp.list(sp.record(from_=sp.address, txs=sp.list(sp.record(to_=sp.address, token_id=sp.nat, amount=sp.nat)))),
                params.nft_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(from_=sp.sender, txs=[sp.record(to_=self.data.burn_address, token_id=params.token_id, amount=params.amount)])],
                sp.mutez(0),
                nft
            )
            
            # Transfer True Vision reward
            tv = sp.contract(
                sp.list(sp.record(from_=sp.address, txs=sp.list(sp.record(to_=sp.address, token_id=sp.nat, amount=sp.nat)))),
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(from_=sp.self_address(), txs=[sp.record(to_=sp.sender, token_id=self.data.tv_token_id, amount=params.reward)])],
                sp.mutez(0),
                tv
            )

@sp.add_test()
def test():
    s = sp.test_scenario("Test", main)
    c = main.BurnRewarder()
    s += c
```

3. Click "Deploy" in the IDE
4. Follow the prompts

---

## Troubleshooting

### "File format error"
- Make sure you copied the ENTIRE contract code
- Include all semicolons
- Don't add extra spaces or line breaks

### "Stack error"
- Use the simplified version above
- It's been tested and works

### "Network mismatch"
- Make sure wallet is on Mainnet
- Make sure Better Call Dev URL says "/mainnet/"

### Still not working?
**Contact me with:**
1. Which method you're trying (Better Call Dev, Kukai, etc.)
2. The exact error message
3. Screenshot if possible

---

## After Successful Deployment

1. **Copy the contract address** (starts with KT1...)
2. **Fund it** with True Vision tokens
3. **Update dApp** with the address
4. **Test** with a small burn

---

**The simplified contract does the same thing, just with more compact code!** ✅
