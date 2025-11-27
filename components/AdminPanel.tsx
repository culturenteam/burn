import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Shield, Rocket, CheckCircle, AlertCircle, Loader, Copy } from 'lucide-react';
import { CREATOR_ADDRESS } from '../constants';

const AdminPanel: React.FC = () => {
  const { userAddress, tezos } = useWallet();
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploymentHash, setDeploymentHash] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = userAddress === CREATOR_ADDRESS;

  if (!isAdmin) {
    return null; // Don't show anything if not admin
  }

  const contractCode = `parameter (or (pair %burn_and_reward
                    (address %nft_contract)
                    (pair (nat %token_id)
                          (pair (nat %amount)
                                (nat %reward_amount))))
              (or (bool %set_paused)
                  (address %update_admin)));
storage (pair (address %admin)
              (pair (address %true_vision_contract)
                    (pair (nat %true_vision_token_id)
                          (pair (address %burn_address)
                                (bool %paused)))));
code { UNPAIR ;
       IF_LEFT
         { SWAP ;
           DUP ;
           DUG 2 ;
           GET 9 ;
           IF { PUSH string "CONTRACT_PAUSED" ; FAILWITH } {} ;
           SWAP ;
           DUP ;
           DUG 2 ;
           GET 7 ;
           SWAP ;
           DUP ;
           DUG 2 ;
           GET 3 ;
           SWAP ;
           DUP ;
           DUG 2 ;
           GET 5 ;
           SWAP ;
           DUP ;
           DUG 2 ;
           CAR ;
           SWAP ;
           DUP ;
           DUG 2 ;
           GET 3 ;
           SWAP ;
           DUP ;
           DUG 2 ;
           GET 5 ;
           SWAP ;
           GET 7 ;
           NIL operation ;
           DIG 4 ;
           CONTRACT %transfer (list (pair address
                                         (list (pair address (pair nat nat))))) ;
           IF_NONE { PUSH string "INVALID_NFT_CONTRACT" ; FAILWITH } {} ;
           PUSH mutez 0 ;
           NIL (pair address (list (pair address (pair nat nat)))) ;
           NIL (pair address (pair nat nat)) ;
           DIG 6 ;
           DIG 7 ;
           DIG 8 ;
           PAIR 3 ;
           CONS ;
           SENDER ;
           PAIR ;
           CONS ;
           TRANSFER_TOKENS ;
           CONS ;
           DIG 2 ;
           CONTRACT %transfer (list (pair address
                                         (list (pair address (pair nat nat))))) ;
           IF_NONE { PUSH string "INVALID_TV_CONTRACT" ; FAILWITH } {} ;
           PUSH mutez 0 ;
           NIL (pair address (list (pair address (pair nat nat)))) ;
           NIL (pair address (pair nat nat)) ;
           DIG 3 ;
           DIG 3 ;
           SENDER ;
           PAIR 3 ;
           CONS ;
           SELF_ADDRESS ;
           PAIR ;
           CONS ;
           TRANSFER_TOKENS ;
           CONS ;
           DIG 2 ;
           NIL operation ;
           PAIR }
         { IF_LEFT
             { SWAP ;
               DUP ;
               DUG 2 ;
               CAR ;
               SENDER ;
               COMPARE ;
               EQ ;
               IF {} { PUSH string "NOT_ADMIN" ; FAILWITH } ;
               SWAP ;
               UNPAIR ;
               SWAP ;
               UNPAIR ;
               SWAP ;
               UNPAIR ;
               SWAP ;
               UNPAIR ;
               SWAP ;
               DROP ;
               DIG 4 ;
               PAIR ;
               SWAP ;
               PAIR ;
               SWAP ;
               PAIR ;
               SWAP ;
               PAIR ;
               NIL operation }
             { SWAP ;
               DUP ;
               DUG 2 ;
               CAR ;
               SENDER ;
               COMPARE ;
               EQ ;
               IF {} { PUSH string "NOT_ADMIN" ; FAILWITH } ;
               SWAP ;
               CDR ;
               SWAP ;
               PAIR ;
               NIL operation } } ;
       PAIR }`;

  const deployContract = async () => {
    setDeploying(true);
    setError(null);
    setDeployedAddress(null);
    setDeploymentHash(null);

    try {
      console.log('🚀 Starting contract deployment...');

      const initialStorage = {
        admin: userAddress,
        true_vision_contract: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
        true_vision_token_id: 754916,
        burn_address: 'tz1burnburnburnburnburnburnburjAYjjX',
        paused: false
      };

      console.log('📝 Initial storage:', initialStorage);

      const origination = await tezos.wallet.originate({
        code: contractCode,
        storage: initialStorage
      });

      console.log('✅ Deployment initiated:', origination.opHash);
      setDeploymentHash(origination.opHash);

      console.log('⏳ Waiting for confirmation...');
      const contract = await origination.contract();

      const contractAddress = contract.address;
      console.log('🎉 Contract deployed:', contractAddress);

      setDeployedAddress(contractAddress);
      
      // Save to localStorage
      localStorage.setItem('BURN_REWARDER_CONTRACT', contractAddress);

    } catch (err: any) {
      console.error('❌ Deployment failed:', err);
      setError(err.message || 'Deployment failed');
    } finally {
      setDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/50 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      </div>

      <div className="space-y-6">
        {/* Deploy Contract Section */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy Burn Rewarder Contract
          </h3>

          <div className="space-y-4">
            <div className="text-sm text-slate-300 space-y-2">
              <p>This will deploy the smart contract that automatically rewards users with True Vision tokens when they burn NFTs.</p>
              <div className="bg-slate-800/50 rounded p-3 space-y-1 text-xs">
                <p><strong>Admin:</strong> {userAddress}</p>
                <p><strong>True Vision Contract:</strong> KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton</p>
                <p><strong>True Vision Token ID:</strong> 754916</p>
                <p><strong>Burn Address:</strong> tz1burnburnburnburnburnburnburjAYjjX</p>
              </div>
            </div>

            {!deployedAddress && !deploying && (
              <button
                onClick={deployContract}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Deploy Contract (~1 XTZ)
              </button>
            )}

            {deploying && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-blue-400 font-semibold">Deploying contract...</span>
                </div>
                {deploymentHash && (
                  <p className="text-xs text-slate-400 ml-8">
                    Operation: {deploymentHash.slice(0, 10)}...{deploymentHash.slice(-6)}
                  </p>
                )}
                <p className="text-xs text-slate-400 ml-8 mt-1">
                  This may take 1-2 minutes. Please wait...
                </p>
              </div>
            )}

            {deployedAddress && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Contract Deployed Successfully!
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-900/50 rounded p-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Contract Address:</p>
                      <p className="text-sm font-mono text-white">{deployedAddress}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(deployedAddress)}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <a
                    href={`https://tzkt.io/${deployedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2 px-4 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded transition-colors text-sm"
                  >
                    View on TzKT Explorer →
                  </a>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm text-yellow-200">
                  <p className="font-semibold mb-2">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Fund the contract with True Vision tokens</li>
                    <li>Update constants/index.ts with this address</li>
                    <li>Rebuild and redeploy the dApp</li>
                    <li>Test with a small burn first!</li>
                  </ol>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Deployment Failed
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={deployContract}
                  className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Note:</strong> This admin panel is only visible to the creator address ({CREATOR_ADDRESS.slice(0, 10)}...). 
            The deployed contract will automatically send True Vision tokens when users burn NFTs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
