// ============================================
// UI STATE TYPES - GLOBAL LOADING SYSTEM
// ============================================

export interface GlobalLoadingState {
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

export interface ToastNotification {
  id?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
