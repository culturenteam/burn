import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { InfoModal } from '../src/components/InfoModal';

interface LayoutProps {
  children: React.ReactNode;
  isConnected: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isConnected }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 z-10 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight">BRUTALISTI</h1>
                <div className="text-xs uppercase tracking-wider mt-1">NFT BURN PROTOCOL</div>
              </div>
              <button
                onClick={() => setShowInfoModal(true)}
                className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                aria-label="Information"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {isConnected && (
              <div className="border-2 border-black px-3 py-1 text-xs uppercase tracking-wider">
                MAINNET
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black px-8 py-4">
        <div className="text-xs uppercase tracking-wider">
          TEZOS BLOCKCHAIN / FA2 STANDARD / PERMANENT DESTRUCTION
        </div>
      </footer>
    </div>
  );
};
