import { config } from '../config';
import { TransactionDB, PresaleStatsDB } from '../types/database';

// ============================================
// API SERVICE
// ALL BACKEND COMMUNICATION
// ============================================

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Submit transaction to backend for validation and tracking
   */
  async submitTransaction(
    transactionHash: string,
    buyerWallet: string
  ): Promise<{ success: boolean; transaction: TransactionDB; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionHash,
        buyerWallet,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit transaction');
    }

    return response.json();
  }

  /**
   * Get user's transaction history
   */
  async getUserTransactions(wallet: string): Promise<{ success: boolean; transactions: TransactionDB[] }> {
    const response = await fetch(`${this.baseUrl}/api/transactions/user/${wallet}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch transactions');
    }

    return response.json();
  }

  /**
   * Get presale statistics
   */
  async getPresaleStats(): Promise<{ success: boolean; stats: PresaleStatsDB }> {
    const response = await fetch(`${this.baseUrl}/api/transactions/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch presale stats');
    }

    return response.json();
  }
}

export default new ApiService();
