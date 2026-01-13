import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '../../types/wallet';
import web3Service from '../../services/web3Service';

// ============================================
// WALLET SLICE (Wagmi-compatible)
// ============================================

const initialState: WalletState = {
  address: null,
  chainId: null,
  connected: false,
  usdtBalance: '0',
  spraiBalance: '0',
  loading: false,
  error: null,
};

// ⚠️ REDUX THUNK - Refresh Balances
export const refreshBalances = createAsyncThunk(
  'wallet/refreshBalances',
  async (address: string, { rejectWithValue }) => {
    try {
      const usdtBalance = await web3Service.getUsdtBalance(address);
      return { usdtBalance };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    syncWalletState(state, action: PayloadAction<{ address: string; chainId: number }>) {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.connected = true;
    },
    disconnectWallet(state) {
      state.address = null;
      state.chainId = null;
      state.connected = false;
      state.usdtBalance = '0';
      state.spraiBalance = '0';
    },
    setChainId(state, action: PayloadAction<number>) {
      state.chainId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh Balances
      .addCase(refreshBalances.fulfilled, (state, action: PayloadAction<any>) => {
        state.usdtBalance = action.payload.usdtBalance;
      });
  },
});

export const { syncWalletState, disconnectWallet, setChainId } = walletSlice.actions;
export default walletSlice.reducer;
