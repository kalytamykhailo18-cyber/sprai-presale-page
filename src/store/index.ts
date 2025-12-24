import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import walletReducer from './slices/walletSlice';
import transactionReducer from './slices/transactionSlice';
import uiReducer from './slices/uiSlice';

// ============================================
// REDUX STORE CONFIGURATION
// ============================================

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    transaction: transactionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
