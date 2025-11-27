import smartpy as sp

@sp.module
def main():
    # FA2 transfer parameter type - CORRECT ORDER
    t_transfer_params: type = sp.list[
        sp.record(
            from_=sp.address,
            txs=sp.list[
                sp.record(
                    to_=sp.address,
                    token_id=sp.nat,
                    amount=sp.nat
                ).layout(("to_", ("token_id", "amount")))
            ]
        )
    ]
    
    class SimpleSwap(sp.Contract):
        """
        Dead simple: User sends NFT, gets True Vision back.
        User can burn NFT themselves later.
        
        Flow:
        1. User transfers NFT to contract
        2. User calls claim_reward
        3. Contract sends True Vision to user
        
        That's it!
        """
        
        def __init__(self, tv_contract, tv_token_id, reward_amount):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
            self.data.reward_amount = reward_amount
        
        @sp.entrypoint
        def claim_reward(self):
            """
            User calls this after sending NFT to contract.
            Contract sends True Vision reward.
            
            No parameters needed - just send reward to caller!
            """
            
            # Send True Vision to caller
            tv_handle = sp.contract(
                t_transfer_params,
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid TV contract")
            
            tv_transfer = [
                sp.record(
                    from_=sp.self_address,
                    txs=[
                        sp.record(
                            to_=sp.sender,
                            token_id=self.data.tv_token_id,
                            amount=self.data.reward_amount
                        )
                    ]
                )
            ]
            
            sp.transfer(tv_transfer, sp.mutez(0), tv_handle)


@sp.add_test()
def test():
    scenario = sp.test_scenario("SimpleSwap", main)
    scenario.h1("Simple Swap Contract")
    
    user = sp.test_account("User")
    
    contract = main.SimpleSwap(
        tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
        tv_token_id=754916,
        reward_amount=1
    )
    
    scenario += contract
    
    scenario.h2("User claims reward")
    contract.claim_reward(_sender=user)
