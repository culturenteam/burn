import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white border-4 border-black max-w-2xl w-full">
        {/* Header */}
        <div className="bg-brutal-red text-white p-6 border-b-4 border-black flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wider font-mono">
            BURNING BAGS
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-black p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Burning Bags Description */}
          <div className="border-4 border-black p-6 bg-white space-y-4">
            <div className="space-y-3">
              <h3 className="text-xl font-bold uppercase tracking-tight">
                COMING SOON
              </h3>
              <p className="text-sm leading-relaxed">
                A dedicated portal to one of my signature experimental systems. 
                <span className="font-bold"> Burning Bags</span> is a living artwork: 
                part performance, part destruction engine, part game mechanic.
              </p>
            </div>

            <div className="border-t-4 border-black pt-4">
              <p className="text-sm leading-relaxed italic">
                Enter the ritual of loss, transformation, and value inversion.
              </p>
            </div>
          </div>

          {/* True Vision Reward System */}
          <div className="border-4 border-brutal-red p-6 bg-white space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">
              TRUE VISION REWARDS
            </h3>
            
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Burning artworks generates <span className="font-bold">True Vision</span> tokens—
                a dynamic reward system that transforms destruction into value.
              </p>

              <div className="border-t-2 border-black pt-3 space-y-2">
                <h4 className="font-bold uppercase text-xs tracking-wider">BASE REWARD</h4>
                <p>
                  Each artwork's reward is calculated from its market history. 
                  Recent sales generate higher rewards, establishing a living connection 
                  between market activity and burn value.
                </p>
              </div>

              <div className="border-t-2 border-black pt-3 space-y-2">
                <h4 className="font-bold uppercase text-xs tracking-wider">TIME DECAY</h4>
                <p>
                  As time passes since the last sale, the reward gradually decreases. 
                  This creates urgency and reflects the fading heat of market interest. 
                  The decay ensures rewards remain connected to current value perception.
                </p>
              </div>

              <div className="border-t-2 border-black pt-3 space-y-2">
                <h4 className="font-bold uppercase text-xs tracking-wider">EDITION IMPACT</h4>
                <p>
                  Works with higher edition counts receive adjusted rewards. 
                  Scarcity matters—burning one of few is valued differently than 
                  burning one of many. This mechanism respects the economics of supply.
                </p>
              </div>

              <div className="border-t-2 border-black pt-3 space-y-2">
                <h4 className="font-bold uppercase text-xs tracking-wider">MINIMUM GUARANTEE</h4>
                <p>
                  Every burn guarantees a minimum reward, ensuring that even works 
                  with distant sales or high editions retain value in destruction. 
                  No artwork becomes worthless to burn.
                </p>
              </div>

              <div className="border-t-2 border-black pt-3 space-y-2">
                <h4 className="font-bold uppercase text-xs tracking-wider">DISTRIBUTION</h4>
                <p>
                  True Vision rewards are calculated at burn time and distributed 
                  manually by the creator after transaction confirmation. This ensures 
                  accurate tracking and proper reward allocation for each burn event.
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="border-4 border-brutal-red bg-white p-4">
            <p className="text-xs uppercase tracking-wider font-bold">
              ⚠️ EXPERIMENTAL SYSTEM / IRREVERSIBLE ACTIONS
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-white hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
