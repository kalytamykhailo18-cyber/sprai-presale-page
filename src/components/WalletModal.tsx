import React, { useEffect, useState } from 'react';

interface WalletOption {
  name: string;
  icon: string;
  installed: boolean;
  provider: any;
  installUrl: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (provider: any) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [wallets, setWallets] = useState<WalletOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure all wallet extensions have injected their providers
      setTimeout(() => {
        detectWallets();
      }, 100);
    }
  }, [isOpen]);

  const detectWallets = () => {
    const detected: WalletOption[] = [];
    const win = window as any;

    console.log('=== WALLET DETECTION START ===');

    // Check specific wallet globals FIRST (most reliable method)
    const phantomEth = win.phantom?.ethereum;
    const okxWallet = win.okxwallet;
    const binanceWallet = win.BinanceChain;
    const trustWallet = win.trustwallet?.ethereum;
    const coinbaseWallet = win.coinbaseWalletExtension;

    console.log('Wallet globals:', {
      'window.phantom?.ethereum': !!phantomEth,
      'window.okxwallet': !!okxWallet,
      'window.BinanceChain': !!binanceWallet,
      'window.trustwallet?.ethereum': !!trustWallet,
      'window.coinbaseWalletExtension': !!coinbaseWallet,
      'window.ethereum': !!win.ethereum,
      'window.ethereum.providers': win.ethereum?.providers?.length || 0,
    });

    // Collect all providers
    const providers: any[] = [];

    if (win.ethereum?.providers && Array.isArray(win.ethereum.providers)) {
      providers.push(...win.ethereum.providers);
    }
    if (win.ethereum && !providers.includes(win.ethereum)) {
      providers.push(win.ethereum);
    }

    // Helper to safely check a flag on a provider
    const checkFlag = (provider: any, flag: string): boolean => {
      try {
        const value = provider[flag];
        return value === true;
      } catch {
        return false;
      }
    };

    // Helper to check if provider matches any flags
    const hasAnyFlag = (provider: any, flags: string[]): boolean => {
      return flags.some(flag => checkFlag(provider, flag));
    };

    // Find MetaMask provider (exclude Phantom which also sets isMetaMask)
    let metaMaskProvider = null;
    for (const p of providers) {
      const isMetaMask = checkFlag(p, 'isMetaMask');
      const isPhantom = checkFlag(p, 'isPhantom') || p === phantomEth;
      const isBrave = checkFlag(p, 'isBraveWallet');

      if (isMetaMask && !isPhantom && !isBrave) {
        metaMaskProvider = p;
        break;
      }
    }

    detected.push({
      name: 'MetaMask',
      icon: '🦊',
      installed: !!metaMaskProvider,
      provider: metaMaskProvider,
      installUrl: 'https://metamask.io/download/',
    });

    // Phantom - check global first, then providers
    let phantomProvider = phantomEth;
    if (!phantomProvider) {
      for (const p of providers) {
        if (checkFlag(p, 'isPhantom')) {
          phantomProvider = p;
          break;
        }
      }
    }

    detected.push({
      name: 'Phantom',
      icon: '👻',
      installed: !!phantomProvider,
      provider: phantomProvider,
      installUrl: 'https://phantom.app/download',
    });

    // Trust Wallet
    let trustProvider = trustWallet;
    if (!trustProvider) {
      for (const p of providers) {
        if (hasAnyFlag(p, ['isTrust', 'isTrustWallet'])) {
          trustProvider = p;
          break;
        }
      }
    }

    detected.push({
      name: 'Trust Wallet',
      icon: '🛡️',
      installed: !!trustProvider,
      provider: trustProvider,
      installUrl: 'https://trustwallet.com/download',
    });

    // Coinbase Wallet
    let coinbaseProvider = coinbaseWallet;
    if (!coinbaseProvider) {
      for (const p of providers) {
        if (hasAnyFlag(p, ['isCoinbaseWallet', 'isCoinbaseBrowser'])) {
          coinbaseProvider = p;
          break;
        }
      }
    }

    detected.push({
      name: 'Coinbase Wallet',
      icon: '🔵',
      installed: !!coinbaseProvider,
      provider: coinbaseProvider,
      installUrl: 'https://www.coinbase.com/wallet/downloads',
    });

    // Brave Wallet
    let braveProvider = null;
    for (const p of providers) {
      if (checkFlag(p, 'isBraveWallet')) {
        braveProvider = p;
        break;
      }
    }

    detected.push({
      name: 'Brave Wallet',
      icon: '🦁',
      installed: !!braveProvider,
      provider: braveProvider,
      installUrl: 'https://brave.com/wallet/',
    });

    // OKX Wallet
    let okxProvider = okxWallet;
    if (!okxProvider) {
      for (const p of providers) {
        if (hasAnyFlag(p, ['isOkxWallet', 'isOKExWallet'])) {
          okxProvider = p;
          break;
        }
      }
    }

    detected.push({
      name: 'OKX Wallet',
      icon: '⭕',
      installed: !!okxProvider,
      provider: okxProvider,
      installUrl: 'https://www.okx.com/web3',
    });

    // Binance Wallet
    let binanceProvider = binanceWallet;
    if (!binanceProvider) {
      for (const p of providers) {
        if (hasAnyFlag(p, ['isBinance', 'isBinanceChain'])) {
          binanceProvider = p;
          break;
        }
      }
    }

    detected.push({
      name: 'Binance Wallet',
      icon: '🟡',
      installed: !!binanceProvider,
      provider: binanceProvider,
      installUrl: 'https://www.binance.com/en/web3wallet',
    });

    // Log detection results
    const installedWallets = detected.filter(w => w.installed);
    console.log('Installed wallets:', installedWallets.map(w => w.name));
    console.log('=== WALLET DETECTION END ===');

    setWallets(detected);
  };

  const handleWalletClick = (wallet: WalletOption) => {
    if (wallet.installed && wallet.provider) {
      onSelect(wallet.provider);
    } else {
      window.open(wallet.installUrl, '_blank');
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
        <p className="text-black/70 mb-6">Select a wallet to connect</p>

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletClick(wallet)}
              className="flex items-center justify-between w-full p-4 border border-black/20 hover:border-black/50 hover:bg-black/5 transition-all"
              style={{ borderRadius: '6px' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <span className="text-lg font-semibold text-black">{wallet.name}</span>
              </div>
              {wallet.installed ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-medium" style={{ borderRadius: '6px' }}>
                  Installed
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: '6px' }}>
                  Install
                </span>
              )}
            </button>
          ))}
        </div>

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
