import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Shield, Rocket, CheckCircle, AlertCircle, Loader, Copy, ExternalLink } from 'lucide-react';
import { CREATOR_ADDRESS } from '../constants';

const AdminPanel: React.FC = () => {
  const { userAddress, tezos } = useWallet();
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploymentHash, setDeploymentHash] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string>('');

  // Check if user is admin
  const isAdmin = userAddress === CREATOR_ADDRESS;

  if (!isAdmin) {
    return null; // Don't show anything if not admin
  }

  const saveContractAddress = () => {
    if (manualAddress && manualAddress.startsWith('KT1')) {
      localStorage.setItem('BURN_REWARDER_CONTRACT', manualAddress);
      setDeployedAddress(manualAddress);
      setManualAddress('');
    }
  };

  const openBetterCallDev = () => {
    window.open('https://better-call.dev/mainnet/deploy', '_blank');
  };

  const deployWithScript = async () => {
    setDeploying(true);
    setError(null);
    setDeployedAddress(null);
    setDeploymentHash(null);

    try {
      console.log('🚀 Deploying reward sender contract...');

      // SmartPy generated Michelson - tested and working
      const michelsonCode = `parameter (pair %send_reward (nat %amount) (address %recipient));
storage (pair (address %tv_contract) (nat %tv_token_id));
code {
  UNPAIR;
  DUP 2;
  CAR;
  CONTRACT %transfer (list (pair (address %from_) (list %txs (pair (nat %amount) (pair (address %to_) (nat %token_id))))));
  IF_NONE { PUSH int 29; FAILWITH } {};
  NIL (pair address (list (pair nat (pair address nat))));
  NIL (pair nat (pair address nat));
  DUP 5;
  CDR;
  DIG 4;
  UNPAIR;
  PAIR 3;
  CONS;
  SELF_ADDRESS;
  PAIR;
  CONS;
  NIL operation;
  DIG 2;
  PUSH mutez 0;
  DIG 3;
  TRANSFER_TOKENS;
  CONS;
  PAIR
}`;

      console.log('📝 Deploying reward sender contract...');

      const op = await tezos.wallet.originate({
        code: michelsonCode,
        init: '(Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" 754916)'
      }).send();

      console.log('✅ Deployment initiated:', op.opHash);
      setDeploymentHash(op.opHash);

      console.log('⏳ Waiting for confirmation (this takes 1-2 minutes)...');
      
      // Wait for operation to be included
      const result = await op.confirmation(1);
      
      console.log('✅ Confirmed! Getting contract address...');
      
      // Get the contract address from the operation
      const operations = await tezos.rpc.getBlock();
      const opData = operations.operations.flat().find((o: any) => o.hash === op.opHash);
      
      if (!opData || !opData.contents) {
        throw new Error('Could not find operation data');
      }
      
      const originationOp = opData.contents.find((c: any) => c.kind === 'origination');
      if (!originationOp || !originationOp.metadata || !originationOp.metadata.operation_result) {
        throw new Error('Could not find origination result');
      }
      
      const contractAddress = originationOp.metadata.operation_result.originated_contracts?.[0];
      
      if (!contractAddress) {
        throw new Error('No contract address in result');
      }

      console.log('🎉 Contract deployed:', contractAddress);

      setDeployedAddress(contractAddress);
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
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-sm text-blue-200">
                  <p className="font-semibold mb-2">✨ Simple Reward Contract</p>
                  <p className="text-xs">This contract only sends True Vision rewards. Burning happens in the dApp.</p>
                </div>

                <button
                  onClick={deployWithScript}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Deploy Reward Contract (~0.5 XTZ)
                </button>

                <button
                  onClick={openBetterCallDev}
                  className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Or use Better Call Dev
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900/50 text-slate-400">Or enter deployed address</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="KT1..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={saveContractAddress}
                    disabled={!manualAddress || !manualAddress.startsWith('KT1')}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                  >
                    Save
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-xs text-blue-200">
                  <p className="font-semibold mb-1">📋 Deployment Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click "Deploy on Better Call Dev"</li>
                    <li>Paste contract code from <code className="bg-slate-800 px-1 rounded">contracts/burn_rewarder_final.tz</code></li>
                    <li>Set storage with your address</li>
                    <li>Deploy and copy the contract address</li>
                    <li>Paste address above and click Save</li>
                  </ol>
                </div>
              </div>
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
