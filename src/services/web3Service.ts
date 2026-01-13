import { ethers, BrowserProvider, JsonRpcProvider } from 'ethers';
import { config } from '../config';

// ============================================
// WEB3 SERVICE (Wagmi-compatible)
// ALL CONFIGURATION FROM ENVIRONMENT VARIABLES
// ZERO HARDCODED VALUES
// ============================================

// ⚠️ CRITICAL: ABIs for smart contract interaction
const USDT_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

const PRESALE_ABI = [
  'function buyTokens(uint256 usdtAmount) external',
  'function calculateSpraiAmount(uint256 usdtAmount) view returns (uint256)',
  'function getConfig() view returns (uint256 price, uint256 minPurchase, uint256 maxPurchase, bool active)',
];

class Web3Service {
  /**
   * Get read-only provider (no wallet needed)
   * Used for reading balances and contract state
   */
  private getReadProvider(): JsonRpcProvider {
    return new JsonRpcProvider(config.bscRpcUrl);
  }

  /**
   * Get ethers provider from browser wallet (window.ethereum)
   * This works with MetaMask, Trust Wallet, and other injected wallets
   */
  private async getProvider(): Promise<BrowserProvider> {
    // Check if window.ethereum exists (injected by wallet extension or in-app browser)
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return new BrowserProvider((window as any).ethereum);
    }

    throw new Error('No Ethereum provider found. Please install MetaMask or use WalletConnect.');
  }

  /**
   * Get signer from current wallet connection
   */
  private async getSigner(): Promise<ethers.Signer> {
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    return signer;
  }

  /**
   * Get USDT balance for an address
   * Uses read-only provider (no wallet connection required)
   */
  async getUsdtBalance(address: string): Promise<string> {
    // Use read-only provider for balance checks
    const provider = this.getReadProvider();

    const usdtContract = new ethers.Contract(
      config.usdtContract,
      USDT_ABI,
      provider
    );

    try {
      const balance = await usdtContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Error fetching USDT balance:', error);
      return '0';
    }
  }

  /**
   * ⚠️ CRITICAL: Buy SPRAI tokens through PRESALE CONTRACT
   * This triggers AUTOMATIC token distribution
   *
   * FLOW:
   * 1. Approve USDT to presale contract
   * 2. Call presale.buyTokens()
   * 3. Contract automatically transfers USDT to owner and SPRAI to buyer
   */
  async buyTokens(usdtAmount: string): Promise<ethers.TransactionResponse> {
    const signer = await this.getSigner();
    if (!config.presaleContract) throw new Error('Presale contract not configured');

    const amountInWei = ethers.parseUnits(usdtAmount, 18);

    // Get contracts with signer for write operations
    const usdtContract = new ethers.Contract(
      config.usdtContract,
      USDT_ABI,
      signer
    );

    const presaleContract = new ethers.Contract(
      config.presaleContract,
      PRESALE_ABI,
      signer
    );

    // Check current allowance
    const signerAddress = await signer.getAddress();
    const currentAllowance = await usdtContract.allowance(
      signerAddress,
      config.presaleContract
    );

    // Approve USDT if needed
    if (currentAllowance < amountInWei) {
      console.log('Approving USDT for presale contract...');
      const approveTx = await usdtContract.approve(config.presaleContract, amountInWei);
      await approveTx.wait();
      console.log('USDT approved');
    }

    // Call presale contract to buy tokens (AUTOMATIC DISTRIBUTION)
    console.log('Buying SPRAI tokens...');
    const tx = await presaleContract.buyTokens(amountInWei);
    return tx;
  }

  /**
   * Get presale configuration from smart contract
   * Uses read-only provider
   */
  async getPresaleConfig() {
    const provider = this.getReadProvider();
    if (!config.presaleContract) throw new Error('Presale contract not configured');

    const presaleContract = new ethers.Contract(
      config.presaleContract,
      PRESALE_ABI,
      provider
    );

    const [price, minPurchase, maxPurchase, active] = await presaleContract.getConfig();

    return {
      tokenPriceUsdt: ethers.formatUnits(price, 18),
      minPurchaseUsdt: ethers.formatUnits(minPurchase, 18),
      maxPurchaseUsdt: ethers.formatUnits(maxPurchase, 18),
      presaleActive: active,
    };
  }

  /**
   * Calculate SPRAI amount from USDT amount
   */
  calculateSpraiAmount(usdtAmount: number): string {
    return (usdtAmount / config.tokenPriceUsdt).toFixed(2);
  }
}

export default new Web3Service();
