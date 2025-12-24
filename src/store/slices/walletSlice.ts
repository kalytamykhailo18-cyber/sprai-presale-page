import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '../../types/wallet';
import web3Service from '../../services/web3Service';
import { startLoading, stopLoading, setError } from './uiSlice';

// ============================================
// WALLET SLICE WITH REDUX THUNKS
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

// ⚠️ REDUX THUNK - Connect Wallet
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Connecting wallet...'));
      const { address, chainId } = await web3Service.connectWallet();
      const usdtBalance = await web3Service.getUsdtBalance(address);
      dispatch(stopLoading());
      return { address, chainId, usdtBalance };
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

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
      // Connect Wallet
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.address = action.payload.address;
        state.chainId = action.payload.chainId;
        state.usdtBalance = action.payload.usdtBalance;
        state.connected = true;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh Balances
      .addCase(refreshBalances.fulfilled, (state, action: PayloadAction<any>) => {
        state.usdtBalance = action.payload.usdtBalance;
      });
  },
});

export const { disconnectWallet, setChainId } = walletSlice.actions;
export default walletSlice.reducer;
