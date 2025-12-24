import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalLoadingState, ToastNotification } from '../../types/ui';

// ============================================
// UI SLICE - GLOBAL LOADING SYSTEM
// ============================================

interface UIState extends GlobalLoadingState {
  notifications: ToastNotification[];
}

const initialState: UIState = {
  isLoading: false,
  loadingMessage: '',
  error: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction<string>) {
      state.isLoading = true;
      state.loadingMessage = action.payload;
      state.error = null;
    },
    stopLoading(state) {
      state.isLoading = false;
      state.loadingMessage = '';
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    addNotification(state, action: PayloadAction<ToastNotification>) {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
