import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { connectWallet, disconnectWallet } from '../store/slices/walletSlice';
import { config } from '../config';
import WalletModal from './WalletModal';
import web3Service from '../services/web3Service';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { address, connected } = useAppSelector((state) => state.wallet);
  const { isLoading, loadingMessage } = useAppSelector((state) => state.ui);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (provider: any) => {
    setShowWalletModal(false);
    web3Service.setSelectedProvider(provider);
    await dispatch(connectWallet());
  };

  const handleDisconnectWallet = () => {
    dispatch(disconnectWallet());
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(255, 215, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo with Network Badge */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-black">SPRAI</span>
                <span className="text-2xl sm:text-3xl font-light text-black/70 ml-1">Token</span>
              </Link>
              <span
                className={`px-2 py-1 text-xs font-semibold ${
                  config.isMainnet
                    ? 'bg-green-500/80 text-white'
                    : 'bg-orange-500/80 text-white'
                }`}
                style={{ borderRadius: '6px' }}
              >
                {config.isMainnet ? 'MAINNET' : 'TESTNET'}
              </span>
            </div>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`text-lg font-medium transition-colors ${
                  isActive('/')
                    ? 'text-black font-bold'
                    : 'text-black/70 hover:text-black'
                }`}
              >
                Home
              </Link>
              <Link
                to="/presale"
                className={`text-lg font-medium transition-colors ${
                  isActive('/presale')
                    ? 'text-black font-bold'
                    : 'text-black/70 hover:text-black'
                }`}
              >
                Presale
              </Link>
            </nav>

            {/* Wallet Button */}
            <div>
              {connected && address ? (
                <button
                  onClick={handleDisconnectWallet}
                  className="bg-black/80 text-white px-4 sm:px-6 py-2 sm:py-3 font-semibold hover:bg-black transition-all shadow-md text-sm sm:text-base"
                  style={{ borderRadius: '6px' }}
                >
                  <span className="hidden sm:inline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span className="sm:hidden">
                    {address.slice(0, 4)}...{address.slice(-2)}
                  </span>
                </button>
              ) : (
                <a
  href="https://criptonopix.app.br/buy-and-sell?tokenSelected=SPRAI"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-black/80 text-white px-4 sm:px-6 py-2 sm:py-3 font-semibold hover:bg-black transition-all shadow-md text-sm sm:text-base inline-block"
  style={{ borderRadius: '6px' }}
>
  Comprar SPRAI
</a>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex space-x-4 pb-4">
            <Link
              to="/"
              className={`flex-1 text-center py-2 font-medium transition-colors ${
                isActive('/')
                  ? 'bg-black/20 text-black font-bold'
                  : 'text-black/70 hover:bg-black/10'
              }`}
              style={{ borderRadius: '6px' }}
            >
              Home
            </Link>
            <Link
              to="/presale"
              className={`flex-1 text-center py-2 font-medium transition-colors ${
                isActive('/presale')
                  ? 'bg-black/20 text-black font-bold'
                  : 'text-black/70 hover:bg-black/10'
              }`}
              style={{ borderRadius: '6px' }}
            >
              Presale
            </Link>
          </nav>
        </div>

        {/* Loading Bar */}
        {isLoading && (
          <div className="w-full bg-black/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span className="text-sm text-black">{loadingMessage || 'Loading...'}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelect={handleWalletSelect}
      />
    </>
  );
};

export default Header;
