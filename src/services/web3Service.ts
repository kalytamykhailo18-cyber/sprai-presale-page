import { ethers, BrowserProvider } from 'ethers';
import { config } from '../config';

// ============================================
// WEB3 SERVICE
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
  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private selectedProvider: any = null;

  setSelectedProvider(provider: any) {
    this.selectedProvider = provider;
  }

  getSelectedProvider(): any {
    return this.selectedProvider;
  }

  async connectWallet(): Promise<{ address: string; chainId: number }> {
    const ethereum = this.selectedProvider;

    if (!ethereum) {
      throw new Error('Please select a wallet first');
    }

    // Request account access
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.provider = new BrowserProvider(ethereum);
    this.signer = await this.provider.getSigner();

    const address = accounts[0];
    const network = await this.provider.getNetwork();
    const chainId = Number(network.chainId);

    // ⚠️ USE CONFIG FOR CHAIN ID
    if (chainId !== config.chainId) {
      await this.switchToBSC();
    }

    return { address, chainId };
  }

  async switchToBSC() {
    const ethereum = this.selectedProvider;
    if (!ethereum) return;

    // ⚠️ USE CONFIG FOR CHAIN ID
    const chainIdHex = '0x' + config.chainId.toString(16);

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (error: any) {
      // Chain not added, add it
      if (error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: config.chainName,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: [config.bscRpcUrl],
            blockExplorerUrls: [config.blockExplorerUrl],
          }],
        });
      }
    }
  }

  async getUsdtBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');

    // ⚠️ USE CONFIG FOR CONTRACT ADDRESS
    const usdtContract = new ethers.Contract(
      config.usdtContract,
      USDT_ABI,
      this.provider
    );

    const balance = await usdtContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
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
    if (!this.signer) throw new Error('Wallet not connected');
    if (!config.presaleContract) throw new Error('Presale contract not configured');

    const amountInWei = ethers.parseUnits(usdtAmount, 18);

    // Get contracts
    const usdtContract = new ethers.Contract(
      config.usdtContract,
      USDT_ABI,
      this.signer
    );

    const presaleContract = new ethers.Contract(
      config.presaleContract,
      PRESALE_ABI,
      this.signer
    );

    // Check current allowance
    const currentAllowance = await usdtContract.allowance(
      await this.signer.getAddress(),
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
   */
  async getPresaleConfig() {
    if (!this.provider) throw new Error('Wallet not connected');
    if (!config.presaleContract) throw new Error('Presale contract not configured');

    const presaleContract = new ethers.Contract(
      config.presaleContract,
      PRESALE_ABI,
      this.provider
    );

    const [price, minPurchase, maxPurchase, active] = await presaleContract.getConfig();

    return {
      tokenPriceUsdt: ethers.formatUnits(price, 18),
      minPurchaseUsdt: ethers.formatUnits(minPurchase, 18),
      maxPurchaseUsdt: ethers.formatUnits(maxPurchase, 18),
      presaleActive: active,
    };
  }

  calculateSpraiAmount(usdtAmount: number): string {
    // ⚠️ USE CONFIG FOR TOKEN PRICE
    return (usdtAmount / config.tokenPriceUsdt).toFixed(2);
  }
}

export default new Web3Service();
