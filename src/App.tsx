import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store';
import Header from './components/Header';
import Home from './pages/Home';
import Presale from './pages/Presale';

// Get basename from environment or use root
const basename = import.meta.env.BASE_URL || '/';

const App: React.FC = () => {
  const { notifications } = useAppSelector((state) => state.ui);

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presale" element={<Presale />} />
        </Routes>

        {/* Notification Toast */}
        {notifications.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-sm shadow-lg p-4 animate-slide-in ${
                  notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : notification.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {notification.type === 'success' ? '✓ Success' : notification.type === 'error' ? '✕ Error' : 'ℹ Info'}
                    </p>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
