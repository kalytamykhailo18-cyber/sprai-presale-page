import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransactionDB, TransactionCreateDTO, PresaleStatsDB } from '../../types/database';
import apiService from '../../services/apiService';
import web3Service from '../../services/web3Service';
import { startLoading, stopLoading, setError, addNotification } from './uiSlice';

// ============================================
// TRANSACTION STATE - TYPED TO MATCH DATABASE
// ============================================

interface TransactionState {
  transactions: TransactionDB[];
  stats: PresaleStatsDB | null;
  currentTransaction: TransactionDB | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  stats: null,
  currentTransaction: null,
  loading: false,
  error: null,
};

// ============================================
// REDUX THUNKS - ASYNC ACTIONS
// ⚠️ ALL API CALLS GO THROUGH THUNKS
// ============================================

// Submit Purchase Transaction Thunk
export const submitPurchase = createAsyncThunk(
  'transaction/submitPurchase',
  async (
    { usdtAmount, address }: { usdtAmount: string; address: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(startLoading('Processing purchase...'));

      // ⚠️ CRITICAL: Call PRESALE CONTRACT for AUTOMATIC distribution
      // This calls presale.buyTokens() which:
      // 1. Transfers USDT from buyer to owner
      // 2. Transfers SPRAI from owner to buyer (AUTOMATIC)
      const tx = await web3Service.buyTokens(usdtAmount);

      dispatch(startLoading('Waiting for transaction confirmation...'));
      await tx.wait();

      // 2. Submit to backend for tracking
      const dto: TransactionCreateDTO = {
        transactionHash: tx.hash,
        buyerWallet: address,
      };

      const response = await apiService.submitTransaction(dto.transactionHash, dto.buyerWallet);

      dispatch(stopLoading());
      dispatch(addNotification({
        type: 'success',
        message: 'Purchase successful! SPRAI tokens sent to your wallet.',
        duration: 5000,
      }));

      return response.transaction;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(addNotification({
        type: 'error',
        message: error.message,
        duration: 5000,
      }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch User Transactions Thunk
export const fetchUserTransactions = createAsyncThunk(
  'transaction/fetchUserTransactions',
  async (wallet: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserTransactions(wallet);
      return response.transactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Presale Stats Thunk
export const fetchPresaleStats = createAsyncThunk(
  'transaction/fetchPresaleStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPresaleStats();
      return response.stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearCurrentTransaction(state) {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Purchase
      .addCase(submitPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitPurchase.fulfilled, (state, action: PayloadAction<TransactionDB>) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.transactions.unshift(action.payload);
      })
      .addCase(submitPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Transactions
      .addCase(fetchUserTransactions.fulfilled, (state, action: PayloadAction<TransactionDB[]>) => {
        state.transactions = action.payload;
      })
      // Fetch Presale Stats
      .addCase(fetchPresaleStats.fulfilled, (state, action: PayloadAction<PresaleStatsDB>) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrentTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
