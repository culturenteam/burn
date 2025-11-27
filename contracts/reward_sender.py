"""
Simple True Vision Reward Sender Contract
Written in SmartPy - compiles to Michelson

Deploy at: https://smartpy.io/ide
"""

import smartpy as sp

@sp.module
def main():
    class RewardSender(sp.Contract):
        def __init__(self, tv_contract, tv_token_id):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
        
        @sp.entrypoint
        def send_reward(self, recipient, amount):
            """Send True Vision tokens to recipient"""
            
            # Get the True Vision contract
            tv = sp.contract(
                sp.list(sp.record(
                    from_=sp.address,
                    txs=sp.list(sp.record(
                        to_=sp.address,
                        token_id=sp.nat,
                        amount=sp.nat
                    ))
                )),
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            # Send True Vision from this contract to recipient
            sp.transfer(
                [sp.record(
                    from_=sp.self_address(),
                    txs=[sp.record(
                        to_=recipient,
                        token_id=self.data.tv_token_id,
                        amount=amount
                    )]
                )],
                sp.mutez(0),
                tv
            )

# For deployment
if "templates" not in __name__:
    @sp.add_test(name="RewardSender")
    def test():
        scenario = sp.test_scenario(main)
        scenario.h1("Reward Sender Test")
        
        # Deploy contract
        c = main.RewardSender(
            tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
            tv_token_id=754916
        )
        scenario += c
        
        # Test sending reward
        scenario.h2("Send Reward")
        c.send_reward(
            recipient=sp.address("tz1ZQ5Y7AWAakAEx9C1gLUGoTXyYgnfPHuht"),
            amount=1000000
        )
