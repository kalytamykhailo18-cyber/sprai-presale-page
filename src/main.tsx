import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { store } from './store';
import { wagmiConfig } from './config/wagmi';
import './index.css';
import './animations.css';

// Create a client for TanStack Query (required by Wagmi)
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
