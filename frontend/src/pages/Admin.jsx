import React, { useState } from 'react';

export default function Admin({
  account, owner, isPaused, tokenName, tokenSymbol, totalSupply,
  treasuryBalance, accounts, addAdmin, removeAdmin, togglePause, showToast,
}) {
  const [adminAddr, setAdminAddr] = useState('');
  const [removeAddr, setRemoveAddr] = useState('');
  const [loading, setLoading] = useState('');

  const isOwner = account?.toLowerCase() === owner?.toLowerCase();

  const handleAction = async (action, fn, args, resetFn) => {
    setLoading(action);
    try {
      await fn(...args);
      showToast(`${action} successful! ✅`);
      if (resetFn) resetFn();
    } catch (err) {
      showToast(err.reason || err.message, 'error');
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Admin Panel</h2>
        <p>Contract administration and access control</p>
      </div>

      {!isOwner && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'var(--warning)' }}>
          <p style={{ color: 'var(--warning)' }}>
            ⚠️ You are not the contract owner. Admin actions require owner privileges.
          </p>
        </div>
      )}

      {/* Contract Overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">📋 Contract Overview</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Token Name</div>
            <div style={{ fontWeight: 600 }}>{tokenName} ({tokenSymbol})</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Total Supply</div>
            <div style={{ fontWeight: 600 }}>{Number(totalSupply).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Treasury</div>
            <div style={{ fontWeight: 600 }}>{Number(treasuryBalance).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Owner</div>
            <span className="address">{owner?.slice(0, 10)}...{owner?.slice(-4)}</span>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Status</div>
            <span className={`badge ${isPaused ? 'badge-danger' : 'badge-success'}`}>
              {isPaused ? '⏸️ Paused' : '✅ Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Pause/Resume */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">{isPaused ? '▶️ Resume Contract' : '⏸️ Pause Contract'}</div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            {isPaused
              ? 'Contract is currently paused. All transfers, mints, and burns are disabled.'
              : 'Pausing will disable all token operations (transfers, mints, burns).'}
          </p>
          <button
            className={`btn ${isPaused ? 'btn-success' : 'btn-danger'}`}
            disabled={!isOwner || loading === 'Pause'}
            onClick={() => handleAction('Pause', togglePause, [])}
          >
            {loading === 'Pause' ? <span className="spinner"></span> : (isPaused ? '▶️' : '⏸️')}
            {isPaused ? ' Resume' : ' Pause'}
          </button>
        </div>

        {/* Add Admin */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">👤 Add Admin</div>
          </div>
          <div className="form-group">
            <label className="form-label">Account</label>
            <select className="form-input" value={adminAddr} onChange={e => setAdminAddr(e.target.value)}>
              <option value="">Select account...</option>
              {accounts.filter(a => a.address !== owner).map(a => (
                <option key={a.address} value={a.address}>
                  #{a.index} {a.address.slice(0, 10)}...
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" disabled={!adminAddr || !isOwner || loading === 'AddAdmin'}
            onClick={() => handleAction('AddAdmin', addAdmin, [adminAddr], () => setAdminAddr(''))}>
            {loading === 'AddAdmin' ? <span className="spinner"></span> : '➕'} Add Admin
          </button>
        </div>
      </div>

      {/* Remove Admin */}
      <div className="card" style={{ marginTop: 24, maxWidth: '50%' }}>
        <div className="card-header">
          <div className="card-title">🚫 Remove Admin</div>
        </div>
        <div className="form-group">
          <label className="form-label">Account</label>
          <select className="form-input" value={removeAddr} onChange={e => setRemoveAddr(e.target.value)}>
            <option value="">Select account...</option>
            {accounts.filter(a => a.address !== owner).map(a => (
              <option key={a.address} value={a.address}>
                #{a.index} {a.address.slice(0, 10)}...
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-danger" disabled={!removeAddr || !isOwner || loading === 'RemoveAdmin'}
          onClick={() => handleAction('RemoveAdmin', removeAdmin, [removeAddr], () => setRemoveAddr(''))}>
          {loading === 'RemoveAdmin' ? <span className="spinner"></span> : '🚫'} Remove Admin
        </button>
      </div>
    </div>
  );
}
