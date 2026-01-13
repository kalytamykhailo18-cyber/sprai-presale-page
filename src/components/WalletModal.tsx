import React, { useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { connectors, connect, status, error } = useConnect();
  const { isConnected } = useAccount();

  // Close modal when connected
  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected, onClose]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Define wallet options with mobile deep links
  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      mobileDeepLink: 'https://metamask.app.link/dapp/' + window.location.host,
      connector: 'injected' as const,
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      mobileDeepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=' + encodeURIComponent(window.location.href),
      connector: 'injected' as const,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '📱',
      description: 'Scan QR code or use mobile wallet',
      connector: 'walletConnect' as const,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      connector: 'injected' as const,
    },
  ];

  const handleWalletClick = async (option: typeof walletOptions[0]) => {
    console.log('Wallet clicked:', option.name, 'Mobile:', isMobile);

    // On mobile, prioritize deep linking for MetaMask and Trust Wallet
    if (isMobile && option.mobileDeepLink && option.id !== 'walletconnect') {
      console.log('Attempting mobile deep link:', option.mobileDeepLink);
      window.location.href = option.mobileDeepLink;
      // Give some time for the app to open before falling back
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Find the connector
    const connector = connectors.find(c => {
      if (option.connector === 'walletConnect') {
        return c.id === 'walletConnect';
      } else {
        return c.id === 'injected';
      }
    });

    if (connector) {
      console.log('Connecting with connector:', connector.id, connector.name);
      try {
        connect({ connector });
        // Wagmi handles the connection internally
        onSelect();
      } catch (err) {
        console.error('Connection error:', err);
      }
    } else {
      console.error('Connector not found for:', option.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '6px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 className="text-2xl font-bold text-black mb-2">Connect Wallet</h2>
        <p className="text-black/70 mb-6">
          {isMobile
            ? 'Select your wallet to connect'
            : 'Connect with browser wallet or scan QR code'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm" style={{ borderRadius: '6px' }}>
            {error.message}
          </div>
        )}

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {walletOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleWalletClick(option)}
              disabled={status === 'pending'}
              className="flex items-center justify-between w-full p-4 border border-black/20 hover:border-black/50 hover:bg-black/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '6px' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{option.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-semibold text-black">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-black/60">{option.description}</div>
                  )}
                </div>
              </div>
              {status === 'pending' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              )}
            </button>
          ))}
        </div>

        {isMobile && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-sm text-blue-800" style={{ borderRadius: '6px' }}>
            <strong>Mobile tip:</strong> If your wallet doesn't open, try using WalletConnect to scan the QR code from your wallet app.
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 border border-black/30 text-black font-semibold hover:bg-black/5 transition-all"
          style={{ borderRadius: '6px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
