import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { connectWallet } from '../../store/slices/walletSlice';
import { fetchUserTransactions } from '../../store/slices/transactionSlice';
import WalletInfo from './sections/WalletInfo';
import PurchaseForm from './sections/PurchaseForm';
import PresaleStats from './sections/PresaleStats';
import WalletModal from '../../components/WalletModal';
import web3Service from '../../services/web3Service';

const Presale: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, connected } = useAppSelector((state) => state.wallet);
  const { transactions } = useAppSelector((state) => state.transaction);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (address) {
      dispatch(fetchUserTransactions(address));
    }
  }, [address, dispatch]);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (provider: any) => {
    setShowWalletModal(false);
    web3Service.setSelectedProvider(provider);
    await dispatch(connectWallet());
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'linear-gradient(to right, #FFD700, #2E8B57)',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 anim-fade-down anim-light-slow">
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#1a1a1a' }}>
            SPRAI Token Presale
          </h1>
          <p className="text-lg sm:text-xl text-black/80">
            Purchase SPRAI tokens with USDT on Binance Smart Chain
          </p>
        </div>

        {/* Connect Wallet Section */}
        {!connected ? (
          <div className="max-w-md mx-auto anim-zoom-in anim-normal anim-delay-200">
            <div
              className="backdrop-blur-md p-8 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                borderRadius: '6px',
              }}
            >
              <div className="text-7xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold mb-4 text-black">Connect Your Wallet</h2>
              <p className="text-black/70 mb-6">
                Connect your wallet to participate in the presale
              </p>
              <button
                onClick={handleConnectWallet}
                className="w-full py-4 font-bold text-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
                  borderRadius: '6px',
                }}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Wallet Info */}
            <div className="lg:col-span-1 space-y-8 anim-fade-left anim-light-slow">
              <PresaleStats />
              <WalletInfo />
            </div>

            {/* Right Column - Purchase Form */}
            <div className="lg:col-span-2 anim-fade-right anim-light-slow">
              <PurchaseForm />

              {/* Transaction History */}
              {transactions.length > 0 && (
                <div
                  className="mt-8 backdrop-blur-md p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 text-black">Your Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/30 border-b border-black/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-black/80">Date</th>
                          <th className="px-4 py-3 text-left text-black/80">USDT</th>
                          <th className="px-4 py-3 text-left text-black/80">SPRAI</th>
                          <th className="px-4 py-3 text-left text-black/80">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx, index) => (
                          <tr
                            key={tx.id}
                            className={`border-b border-black/10 hover:bg-white/20 anim-fade-up anim-normal anim-delay-${index * 100}`}
                          >
                            <td className="px-4 py-3 text-black">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-black">
                              {parseFloat(tx.usdtAmount).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-black">
                              {parseFloat(tx.spraiAmount).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-semibold ${
                                  tx.validated
                                    ? 'bg-green-500/30 text-green-900'
                                    : 'bg-yellow-500/30 text-yellow-900'
                                }`}
                                style={{ borderRadius: '6px' }}
                              >
                                {tx.validated ? 'Validated' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelect={handleWalletSelect}
      />
    </div>
  );
};

export default Presale;
