/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Network Selection
  readonly VITE_NETWORK: 'mainnet' | 'testnet';

  // Mainnet Configuration
  readonly VITE_BSC_MAINNET_RPC: string;
  readonly VITE_CHAIN_ID_MAINNET: string;
  readonly VITE_USDT_CONTRACT_MAINNET: string;
  readonly VITE_SPRAI_TOKEN_CONTRACT_MAINNET: string;
  readonly VITE_PRESALE_CONTRACT_MAINNET: string;

  // Testnet Configuration
  readonly VITE_BSC_TESTNET_RPC: string;
  readonly VITE_CHAIN_ID_TESTNET: string;
  readonly VITE_USDT_CONTRACT_TESTNET: string;
  readonly VITE_SPRAI_TOKEN_CONTRACT_TESTNET: string;
  readonly VITE_PRESALE_CONTRACT_TESTNET: string;

  // Common Configuration
  readonly VITE_TOKEN_PRICE_USDT: string;
  readonly VITE_MIN_PURCHASE_USDT: string;
  readonly VITE_MAX_PURCHASE_USDT: string;
  readonly VITE_OWNER_WALLET: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: any;
}
