"""
Simple True Vision Reward Sender Contract
Written in SmartPy - compiles to Michelson

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
    
    class RewardSender(sp.Contract):
        def __init__(self, tv_contract, tv_token_id):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
        
        @sp.entrypoint
        def send_reward(self, params):
            """Send True Vision tokens to recipient"""
            # Get the True Vision contract
            tv_handle = sp.contract(
                t_transfer_params,
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            # Build transfer params
            transfer_data = [
                sp.record(
                    from_=sp.self_address,
                    txs=[
                        sp.record(
                            to_=params.recipient,
                            token_id=self.data.tv_token_id,
                            amount=params.amount
                        )
                    ]
                )
            ]
            
            # Send True Vision from this contract to recipient
            sp.transfer(transfer_data, sp.mutez(0), tv_handle)

# For deployment
if "templates" not in __name__:
    @sp.add_test()
    def test():
        scenario = sp.test_scenario("RewardSender", main)
        scenario.h1("Reward Sender Test")
        
        # Deploy contract
        c = main.RewardSender(
            tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
            tv_token_id=754916
        )
        scenario += c
        
        # Just show the contract is deployed - don't test send_reward
        # (would need mock FA2 contract for full test)
        scenario.h2("Contract Deployed Successfully")
        scenario.p("Ready to send rewards!")
