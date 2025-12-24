// ============================================
// DATABASE TYPES - MUST MATCH BACKEND SCHEMA
// ============================================

export interface TransactionDB {
  id: number;
  transactionHash: string;
  buyerWallet: string;
  usdtAmount: string;  // DECIMAL in DB
  spraiAmount: string; // DECIMAL in DB
  tokenPrice: string;  // DECIMAL in DB
  blockNumber: number;
  timestamp: Date;
  validated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresaleStatsDB {
  totalTransactions: number;
  totalUsdtRaised: string;
  totalSpraiSold: string;
  uniqueBuyers: number;
}

// DTO for creating transaction
export interface TransactionCreateDTO {
  transactionHash: string;
  buyerWallet: string;
}
