import React from 'react';
import { useAppSelector } from '../../../store';

const WalletInfo: React.FC = () => {
  const { address, usdtBalance } = useAppSelector((state) => state.wallet);

  if (!address) return null;

  return (
    <div
      className="backdrop-blur-md p-6 anim-fade-up anim-light-slow anim-delay-200"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',
      }}
    >
      <h3 className="text-xl font-bold mb-4 text-black">Wallet Information</h3>
      <div>
        <div className="flex justify-between items-center pb-4">
          <span className="text-sm text-black/70">Connected Wallet:</span>
          <span className="text-sm font-mono font-bold text-black break-all">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <div className="border-t border-black/30 mb-4" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-black/70">USDT Balance:</span>
          <span className="text-base font-bold text-black">
            {parseFloat(usdtBalance).toFixed(2)} USDT
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
