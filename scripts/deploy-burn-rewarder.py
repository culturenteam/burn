"""
Burn Rewarder Smart Contract
Deploy this contract to automate True Vision reward distribution
"""

import smartpy as sp

@sp.module
def main():
    class BurnRewarder(sp.Contract):
        """
        Smart contract that burns NFTs and automatically rewards users with True Vision tokens
        """
        
        def __init__(self, admin, true_vision_contract, true_vision_token_id, burn_address):
            """
            Initialize the contract
            
            Args:
                admin: Address that can manage the contract
                true_vision_contract: Address of True Vision FA2 contract
                true_vision_token_id: Token ID of True Vision
                burn_address: Address to send burned NFTs to
            """
            self.data.admin = admin
            self.data.true_vision_contract = true_vision_contract
            self.data.true_vision_token_id = true_vision_token_id
            self.data.burn_address = burn_address
            self.data.paused = False
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            """
            Burn an NFT and send True Vision reward to the burner
            
            Args:
                params.nft_contract: Address of the NFT contract
                params.token_id: Token ID to burn
                params.amount: Number of editions to burn
                params.reward_amount: True Vision tokens to send (calculated by frontend)
            """
            # Verify contract is not paused
            assert not self.data.paused, "Contract is paused"
            
            # 1. Transfer NFT from user to burn address
            nft_transfer_type = sp.list(
                sp.record(
                    from_=sp.address,
                    txs=sp.list(
                        sp.record(
                            to_=sp.address,
                            token_id=sp.nat,
                            amount=sp.nat
                        )
                    )
                )
            )
            
            nft_contract = sp.contract(
                nft_transfer_type,
                params.nft_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid NFT contract")
            
            sp.transfer(
                [
                    sp.record(
                        from_=sp.sender,
                        txs=[
                            sp.record(
                                to_=self.data.burn_address,
                                token_id=params.token_id,
                                amount=params.amount
                            )
                        ]
                    )
                ],
                sp.mutez(0),
                nft_contract
            )
            
            # 2. Transfer True Vision reward from contract to user
            tv_transfer_type = sp.list(
                sp.record(
                    from_=sp.address,
                    txs=sp.list(
                        sp.record(
                            to_=sp.address,
                            token_id=sp.nat,
                            amount=sp.nat
                        )
                    )
                )
            )
            
            tv_contract = sp.contract(
                tv_transfer_type,
                self.data.true_vision_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid True Vision contract")
            
            sp.transfer(
                [
                    sp.record(
                        from_=sp.self_address(),
                        txs=[
                            sp.record(
                                to_=sp.sender,
                                token_id=self.data.true_vision_token_id,
                                amount=params.reward_amount
                            )
                        ]
                    )
                ],
                sp.mutez(0),
                tv_contract
            )
        
        @sp.entrypoint
        def withdraw(self, params):
            """
            Withdraw True Vision tokens from the contract (admin only)
            
            Args:
                params.recipient: Address to send tokens to
                params.amount: Amount of tokens to withdraw
            """
            assert sp.sender == self.data.admin, "Only admin can withdraw"
            
            tv_transfer_type = sp.list(
                sp.record(
                    from_=sp.address,
                    txs=sp.list(
                        sp.record(
                            to_=sp.address,
                            token_id=sp.nat,
                            amount=sp.nat
                        )
                    )
                )
            )
            
            tv_contract = sp.contract(
                tv_transfer_type,
                self.data.true_vision_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid True Vision contract")
            
            sp.transfer(
                [
                    sp.record(
                        from_=sp.self_address(),
                        txs=[
                            sp.record(
                                to_=params.recipient,
                                token_id=self.data.true_vision_token_id,
                                amount=params.amount
                            )
                        ]
                    )
                ],
                sp.mutez(0),
                tv_contract
            )
        
        @sp.entrypoint
        def set_paused(self, paused):
            """
            Pause or unpause the contract (admin only)
            
            Args:
                paused: True to pause, False to unpause
            """
            assert sp.sender == self.data.admin, "Only admin can pause"
            self.data.paused = paused
        
        @sp.entrypoint
        def update_admin(self, new_admin):
            """
            Transfer admin rights to a new address (admin only)
            
            Args:
                new_admin: New admin address
            """
            assert sp.sender == self.data.admin, "Only admin can update admin"
            self.data.admin = new_admin


# Test scenarios
@sp.add_test()
def test():
    scenario = sp.test_scenario("BurnRewarder", main)
    scenario.h1("Burn Rewarder Contract Tests")
    
    # Test accounts
    admin = sp.test_account("Admin")
    user = sp.test_account("User")
    
    # Contract addresses (use actual addresses for deployment)
    true_vision_contract = sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton")
    burn_address = sp.address("tz1burnburnburnburnburnburnburjAYjjX")
    
    scenario.h2("Contract Deployment")
    contract = main.BurnRewarder(
        admin=admin.address,
        true_vision_contract=true_vision_contract,
        true_vision_token_id=754916,
        burn_address=burn_address
    )
    scenario += contract
    
    scenario.h2("Test Pause/Unpause")
    contract.set_paused(True, _sender=admin)
    contract.set_paused(False, _sender=admin)
    
    scenario.h2("Test Admin Update")
    contract.update_admin(user.address, _sender=admin)
    contract.update_admin(admin.address, _sender=user)


# Compilation target
sp.add_compilation_target(
    "BurnRewarder",
    main.BurnRewarder(
        admin=sp.address("tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva"),  # Replace with your address
        true_vision_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),  # True Vision contract
        true_vision_token_id=754916,  # True Vision token ID
        burn_address=sp.address("tz1burnburnburnburnburnburnburjAYjjX")  # Burn address
    )
)
