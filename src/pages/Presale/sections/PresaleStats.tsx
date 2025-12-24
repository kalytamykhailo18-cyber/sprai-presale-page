import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchPresaleStats } from '../../../store/slices/transactionSlice';

const PresaleStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchPresaleStats());
    const interval = setInterval(() => {
      dispatch(fetchPresaleStats());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!stats) {
    return (
      <div
        className="backdrop-blur-md p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
        }}
      >
        <h3 className="text-xl font-bold mb-4 text-black">Presale Statistics</h3>
        <p className="text-sm text-black/70">Loading statistics...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Raised',
      value: `$${parseFloat(stats.totalUsdtRaised).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: '0',
    },
    {
      label: 'Tokens Sold',
      value: parseFloat(stats.totalSpraiSold).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      gradient: 'linear-gradient(135deg, #2E8B57 0%, #1B5E20 100%)',
      delay: '100',
    },
    {
      label: 'Transactions',
      value: stats.totalTransactions,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      delay: '200',
    },
    {
      label: 'Unique Buyers',
      value: stats.uniqueBuyers,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      delay: '300',
    },
  ];

  return (
    <div
      className="backdrop-blur-md p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',
      }}
    >
      <h3 className="text-xl font-bold mb-6 text-black">Presale Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`p-4 text-white transition-all duration-300 hover:-translate-y-1 anim-fade-up anim-normal anim-delay-${stat.delay}`}
            style={{
              background: stat.gradient,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              borderRadius: '6px',
            }}
          >
            <p className="text-xs opacity-90 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresaleStats;
