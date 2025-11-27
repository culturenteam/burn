"""
Burn and Reward Contract
User calls this contract to burn NFT and get True Vision automatically

Deploy at: https://smartpy.io/ide
"""

import smartpy as sp

@sp.module
def main():
    # FA2 transfer type
    t_transfer_params: type = sp.list[
        sp.record(
            from_=sp.address,
            txs=sp.list[
                sp.record(
                    to_=sp.address,
                    token_id=sp.nat,
                    amount=sp.nat
                )
            ]
        )
    ]
    
    class BurnAndReward(sp.Contract):
        def __init__(self, tv_contract, tv_token_id, burn_address):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
            self.data.burn_address = burn_address
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            """
            Burn NFT and send True Vision reward
            User calls this with their NFT details
            Contract does everything in one transaction
            """
            
            # Step 1: Transfer NFT from user to burn address
            nft_handle = sp.contract(
                t_transfer_params,
                params.nft_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            nft_transfer = [
                sp.record(
                    from_=sp.sender,  # From the user
                    txs=[
                        sp.record(
                            to_=self.data.burn_address,  # To burn address
                            token_id=params.nft_token_id,
                            amount=params.nft_amount
                        )
                    ]
                )
            ]
            
            sp.transfer(nft_transfer, sp.mutez(0), nft_handle)
            
            # Step 2: Transfer True Vision from contract to user
            tv_handle = sp.contract(
                t_transfer_params,
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            tv_transfer = [
                sp.record(
                    from_=sp.self_address,  # From this contract
                    txs=[
                        sp.record(
                            to_=sp.sender,  # To the user
                            token_id=self.data.tv_token_id,
                            amount=params.reward_amount
                        )
                    ]
                )
            ]
            
            sp.transfer(tv_transfer, sp.mutez(0), tv_handle)

# For deployment
if "templates" not in __name__:
    @sp.add_test()
    def test():
        scenario = sp.test_scenario("BurnAndReward", main)
        scenario.h1("Burn and Reward Contract Test")
        
        # Deploy contract
        c = main.BurnAndReward(
            tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
            tv_token_id=754916,
            burn_address=sp.address("tz1burnburnburnburnburnburnburjAYjjX")
        )
        scenario += c
        
        scenario.h2("Contract Deployed Successfully")
        scenario.p("User calls burn_and_reward with NFT details")
        scenario.p("Contract burns NFT and sends True Vision in ONE transaction")
