import React, { useState } from 'react';
import { useContract } from './hooks/useContract';
import Dashboard from './pages/Dashboard';
import Tokens from './pages/Tokens';
import Treasury from './pages/Treasury';
import Admin from './pages/Admin';
import Transactions from './pages/Transactions';

const NAV_ITEMS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'tokens', label: '🪙 Tokens' },
  { id: 'treasury', label: '🏦 Treasury' },
  { id: 'transactions', label: '📜 Transactions' },
  { id: 'admin', label: '⚙️ Admin' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const contractData = useContract();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const props = { ...contractData, showToast };

  if (contractData.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Connecting to blockchain...</p>
        </div>
      </div>
    );
  }

  if (contractData.error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>⚠️ Connection Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{contractData.error}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
            Make sure the local Hardhat node is running:<br />
            <code style={{ color: 'var(--accent)' }}>npx hardhat node</code>
          </p>
          <button className="btn btn-primary" onClick={contractData.connect}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🐾</span>
          <h1>PawToken</h1>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Account Switcher */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
          <label className="form-label">Active Account</label>
          <select
            className="form-input"
            value={contractData.account}
            onChange={(e) => {
              const idx = contractData.accounts.findIndex(a => a.address === e.target.value);
              if (idx >= 0) contractData.switchAccount(idx);
            }}
            style={{ fontSize: 11 }}
          >
            {contractData.accounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                #{acc.index} {acc.address.slice(0, 6)}...{acc.address.slice(-4)}
              </option>
            ))}
          </select>
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <span className={`connection-dot ${contractData.connected ? 'connected' : 'disconnected'}`}></span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {contractData.connected ? 'Local Node' : 'Disconnected'}
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {page === 'dashboard' && <Dashboard {...props} />}
        {page === 'tokens' && <Tokens {...props} />}
        {page === 'treasury' && <Treasury {...props} />}
        {page === 'transactions' && <Transactions {...props} />}
        {page === 'admin' && <Admin {...props} />}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
