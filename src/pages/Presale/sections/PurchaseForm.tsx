import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { submitPurchase } from '../../../store/slices/transactionSlice';
import { config } from '../../../config';
import web3Service from '../../../services/web3Service';

const PurchaseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, usdtBalance } = useAppSelector((state) => state.wallet);
  const { loading } = useAppSelector((state) => state.transaction);

  const [usdtAmount, setUsdtAmount] = useState<string>('');
  const [spraiAmount, setSpraiAmount] = useState<string>('0.00');

  const handleUsdtChange = (value: string) => {
    setUsdtAmount(value);
    const numValue = parseFloat(value) || 0;
    setSpraiAmount(web3Service.calculateSpraiAmount(numValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(usdtAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < config.minPurchaseUsdt) {
      alert(`Minimum purchase is ${config.minPurchaseUsdt} USDT`);
      return;
    }

    if (amount > config.maxPurchaseUsdt) {
      alert(`Maximum purchase is ${config.maxPurchaseUsdt} USDT`);
      return;
    }

    if (amount > parseFloat(usdtBalance)) {
      alert('Insufficient USDT balance');
      return;
    }

    await dispatch(submitPurchase({ usdtAmount, address }));
    setUsdtAmount('');
    setSpraiAmount('0.00');
  };

  return (
    <div
      className="backdrop-blur-md p-6 sm:p-8"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-black">Purchase SPRAI Tokens</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* USDT Amount Input */}
        <div className="anim-fade-up anim-light-slow">
          <label htmlFor="usdt-amount" className="block text-sm font-medium text-black/80 mb-2">
            Amount to Pay
          </label>
          <div className="relative">
            <input
              id="usdt-amount"
              type="number"
              value={usdtAmount}
              onChange={(e) => handleUsdtChange(e.target.value)}
              placeholder="Enter USDT amount"
              disabled={loading || !address}
              step="0.01"
              min={config.minPurchaseUsdt}
              max={config.maxPurchaseUsdt}
              className="w-full px-4 py-3 pr-16 border border-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-white/30 disabled:cursor-not-allowed text-base bg-white/50"
              style={{ borderRadius: '6px' }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 font-medium">
              USDT
            </span>
          </div>
          <p className="text-xs text-black/60 mt-2">
            Min: ${config.minPurchaseUsdt} | Max: ${config.maxPurchaseUsdt}
          </p>
        </div>

        {/* SPRAI Amount Display */}
        <div className="anim-fade-up anim-light-slow anim-delay-200">
          <label htmlFor="sprai-amount" className="block text-sm font-medium text-black/80 mb-2">
            You will receive
          </label>
          <input
            id="sprai-amount"
            type="text"
            value={`${spraiAmount} SPRAI`}
            disabled
            readOnly
            className="w-full px-4 py-3 border border-black/30 bg-white/50 font-bold text-lg text-black"
            style={{ borderRadius: '6px' }}
          />
          <p className="text-xs text-black/60 mt-2">
            Price: ${config.tokenPriceUsdt} USDT per SPRAI
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !address || !usdtAmount}
          className="w-full py-4 font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed anim-fade-up anim-light-slow anim-delay-400"
          style={{
            background: loading || !address || !usdtAmount
              ? '#9ca3af'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            boxShadow: loading || !address || !usdtAmount
              ? 'none'
              : '0 4px 12px rgba(102, 126, 234, 0.4)',
            borderRadius: '6px',
          }}
        >
          {loading ? 'Processing...' : 'Buy SPRAI Tokens'}
        </button>

        {/* Info Box */}
        <div
          className="p-4 border-l-4 border-black/50 anim-fade-up anim-light-slow anim-delay-600"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
          }}
        >
          <p className="text-sm font-bold text-black mb-2">Important Information</p>
          <ul className="text-sm text-black/80 space-y-1 pl-5 list-disc">
            <li>Tokens are sent automatically after confirmation</li>
            <li>Make sure you have enough USDT on BSC network</li>
            <li>Transaction requires two MetaMask confirmations</li>
            <li>Gas fees are paid separately in BNB</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;
