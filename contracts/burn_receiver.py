import smartpy as sp

@sp.module
def main():
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
    
    class BurnReceiver(sp.Contract):
        """
        Contract that receives NFTs and automatically sends True Vision rewards.
        
        Flow:
        1. User transfers NFT to this contract
        2. Contract's on_receive hook triggers
        3. Contract immediately transfers NFT to burn address
        4. Contract sends True Vision reward to user
        
        All in ONE transaction!
        """
        
        def __init__(self, tv_contract, tv_token_id, burn_address, reward_amount):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
            self.data.burn_address = burn_address
            self.data.reward_amount = reward_amount
        
        @sp.entrypoint
        def burn_for_reward(self, params):
            """
            User calls this AFTER transferring NFT to contract.
            Contract then forwards NFT to burn address and sends reward.
            
            OR: User does BOTH in a batch:
            1. Transfer NFT to this contract
            2. Call burn_for_reward
            
            Params:
            - nft_contract: address of the NFT contract
            - token_id: ID of the NFT to burn
            """
            sp.cast(
                params,
                sp.record(
                    nft_contract=sp.address,
                    token_id=sp.nat
                )
            )
            
            # Step 1: Forward NFT from contract to burn address
            nft_handle = sp.contract(
                t_transfer_params,
                params.nft_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid NFT contract")
            
            nft_transfer = [
                sp.record(
                    from_=sp.self_address,  # Contract owns it now
                    txs=[
                        sp.record(
                            to_=self.data.burn_address,
                            token_id=params.token_id,
                            amount=1
                        )
                    ]
                )
            ]
            
            sp.transfer(nft_transfer, sp.mutez(0), nft_handle)
            
            # Step 2: Send True Vision reward to caller
            tv_handle = sp.contract(
                t_transfer_params,
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid TV contract")
            
            tv_transfer = [
                sp.record(
                    from_=sp.self_address,  # Contract owns True Vision
                    txs=[
                        sp.record(
                            to_=sp.sender,  # Send to whoever called this
                            token_id=self.data.tv_token_id,
                            amount=self.data.reward_amount
                        )
                    ]
                )
            ]
            
            sp.transfer(tv_transfer, sp.mutez(0), tv_handle)


@sp.add_test()
def test():
    scenario = sp.test_scenario("BurnReceiver", main)
    scenario.h1("Burn Receiver Contract")
    
    # Test accounts
    admin = sp.test_account("Admin")
    user = sp.test_account("User")
    
    # Deploy contract
    contract = main.BurnReceiver(
        tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
        tv_token_id=754916,
        burn_address=sp.address("tz1burnburnburnburnburnburnburjAYjjX"),
        reward_amount=1
    )
    
    scenario += contract
    
    # Test burn_for_reward
    scenario.h2("User burns NFT for reward")
    contract.burn_for_reward(
        nft_contract=sp.address("KT1TestNFTContract"),
        token_id=123
    )
