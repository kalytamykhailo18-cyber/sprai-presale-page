// ============================================
// WAGMI CONFIGURATION FOR WALLET CONNECTIONS
// Supports: Browser Extensions + WalletConnect (Mobile)
// ============================================

import { createConfig, http } from '@wagmi/core';
import { bsc, bscTestnet } from '@wagmi/core/chains';
import { walletConnect, injected } from '@wagmi/connectors';
import { config } from './index';

// ============================================
// CHAIN CONFIGURATION
// Select chain based on environment
// ============================================
const targetChain = config.isMainnet ? bsc : bscTestnet;
const chains = [targetChain] as const;

// ============================================
// CONNECTORS
// ============================================
const connectors = [
  // Browser Extension Wallets (MetaMask, Trust Wallet, etc.)
  injected({ shimDisconnect: true }),

  // WalletConnect for Mobile Wallets
  walletConnect({
    projectId: config.walletConnectProjectId,
    metadata: {
      name: 'SPRAI Token Presale',
      description: 'Buy SPRAI tokens with USDT on BSC',
      url: config.websiteUrl || 'https://spraicoin.com',
      icons: ['https://spraicoin.com/logo.png'],
    },
    showQrModal: true,
  }),
];

// ============================================
// WAGMI CONFIG
// ============================================

// Build transports object based on target chain
const transports = config.isMainnet
  ? { [bsc.id]: http(config.bscRpcUrl || undefined) }
  : { [bscTestnet.id]: http(config.bscRpcUrl || undefined) };

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: transports as any, // Type assertion needed for dynamic chain selection
});

export { chains, targetChain };
