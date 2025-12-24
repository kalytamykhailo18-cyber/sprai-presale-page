// ============================================
// WALLET STATE TYPES
// ============================================

export interface WalletState {
  address: string | null;
  chainId: number | null;
  connected: boolean;
  usdtBalance: string;
  spraiBalance: string;
  loading: boolean;
  error: string | null;
}
