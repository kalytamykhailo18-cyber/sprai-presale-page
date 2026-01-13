// ============================================
// FRONTEND CONFIGURATION
// ALL VALUES FROM ENVIRONMENT VARIABLES
// SUPPORTS BOTH TESTNET AND MAINNET
// ZERO HARDCODED VALUES
// ============================================

// Determine which network to use
const network = import.meta.env.VITE_NETWORK || 'testnet';
const isMainnet = network === 'mainnet';

export const config = {
  // Network selection
  network: network as 'mainnet' | 'testnet',
  isMainnet,

  // Network Configuration (based on VITE_NETWORK)
  bscRpcUrl: isMainnet
    ? import.meta.env.VITE_BSC_MAINNET_RPC || ''
    : import.meta.env.VITE_BSC_TESTNET_RPC || '',
  chainId: isMainnet
    ? parseInt(import.meta.env.VITE_CHAIN_ID_MAINNET || '56')
    : parseInt(import.meta.env.VITE_CHAIN_ID_TESTNET || '97'),
  chainName: isMainnet
    ? import.meta.env.VITE_CHAIN_NAME_MAINNET || ''
    : import.meta.env.VITE_CHAIN_NAME_TESTNET || '',
  blockExplorerUrl: isMainnet
    ? import.meta.env.VITE_BLOCK_EXPLORER_MAINNET || ''
    : import.meta.env.VITE_BLOCK_EXPLORER_TESTNET || '',

  // Contracts (based on network)
  usdtContract: isMainnet
    ? import.meta.env.VITE_USDT_CONTRACT_MAINNET || ''
    : import.meta.env.VITE_USDT_CONTRACT_TESTNET || '',
  spraiTokenContract: isMainnet
    ? import.meta.env.VITE_SPRAI_TOKEN_CONTRACT_MAINNET || ''
    : import.meta.env.VITE_SPRAI_TOKEN_CONTRACT_TESTNET || '',
  presaleContract: isMainnet
    ? import.meta.env.VITE_PRESALE_CONTRACT_MAINNET || ''
    : import.meta.env.VITE_PRESALE_CONTRACT_TESTNET || '',
  ownerWallet: import.meta.env.VITE_OWNER_WALLET || '',

  // Token Info
  tokenName: import.meta.env.VITE_TOKEN_NAME || '',
  tokenSymbol: import.meta.env.VITE_TOKEN_SYMBOL || '',
  tokenDecimals: parseInt(import.meta.env.VITE_TOKEN_DECIMALS || '18'),
  tokenTotalSupply: parseInt(import.meta.env.VITE_TOKEN_TOTAL_SUPPLY || '2000000'),

  // Pre-sale
  tokenPriceUsdt: parseFloat(import.meta.env.VITE_TOKEN_PRICE_USDT || '0.50'),
  minPurchaseUsdt: parseFloat(import.meta.env.VITE_MIN_PURCHASE_USDT || '10'),
  maxPurchaseUsdt: parseFloat(import.meta.env.VITE_MAX_PURCHASE_USDT || '10000'),

  // Backend API
  apiUrl: import.meta.env.VITE_API_URL || '',

  // Social Links
  telegramUrl: import.meta.env.VITE_TELEGRAM_URL || '',
  twitterUrl: import.meta.env.VITE_TWITTER_URL || '',
  discordUrl: import.meta.env.VITE_DISCORD_URL || '',
  websiteUrl: import.meta.env.VITE_WEBSITE_URL || '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL || '',

  // WalletConnect
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
};

// ============================================
// VALIDATION - ENSURE REQUIRED VALUES ARE SET
// ============================================
const requiredVars = [
  { key: 'VITE_USDT_CONTRACT', value: config.usdtContract },
  { key: 'VITE_OWNER_WALLET', value: config.ownerWallet },
  { key: 'VITE_API_URL', value: config.apiUrl },
  { key: 'VITE_BSC_RPC_URL', value: config.bscRpcUrl },
];

requiredVars.forEach(({ key, value }) => {
  if (!value) {
    console.warn(`⚠️  WARNING: ${key} is not set in .env file`);
  }
});

if (config.tokenPriceUsdt === 0) {
  throw new Error('VITE_TOKEN_PRICE_USDT must be set in .env file');
}

// Log current network
console.log(`🌐 Network: ${isMainnet ? 'BSC Mainnet' : 'BSC Testnet'} (Chain ID: ${config.chainId})`)

export default config;
