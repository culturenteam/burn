import React from 'react';
import { useWallet } from './context/WalletContext';
import { Activity, Wallet, ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const { 
    userAddress, 
    connectWallet, 
    disconnectWallet, 
    loading, 
    error 
  } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200 flex flex-col font-sans selection:bg-tezos selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-dark/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-tezos/20 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-tezos" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-tezos to-blue-400">
              Tezos dApp
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {userAddress && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-500">Ghostnet Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tezos/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-md w-full">
          <div className="bg-card border border-slate-700/50 shadow-2xl rounded-2xl p-8 space-y-8">
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">
                {userAddress ? 'Welcome Back' : 'Connect Wallet'}
              </h1>
              <p className="text-slate-400">
                {userAddress 
                  ? 'You are connected to the Tezos Ghostnet.' 
                  : 'Interact with the Tezos blockchain securely.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            {userAddress ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between group hover:border-tezos/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-tezos rounded-lg shadow-lg shadow-tezos/20">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Connected Address</p>
                      <p className="text-lg font-mono text-white">{shortenAddress(userAddress)}</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>

                <button
                  onClick={disconnectWallet}
                  className="w-full group flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-500 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-tezos to-blue-600 hover:from-blue-600 hover:to-tezos text-white font-bold rounded-xl shadow-lg shadow-tezos/25 hover:shadow-tezos/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect Beacon Wallet</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-slate-500">
                  By connecting, you agree to interact with the Tezos Ghostnet Testnet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;