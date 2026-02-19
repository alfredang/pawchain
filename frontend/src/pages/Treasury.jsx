import React, { useState } from 'react';

export default function Treasury({
  treasuryBalance, balance, tokenSymbol, accounts, account, owner,
  depositTreasury, withdrawTreasury, showToast,
}) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawTo, setWithdrawTo] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState('');

  const isOwner = account?.toLowerCase() === owner?.toLowerCase();

  const handleAction = async (action, fn, args, resetFn) => {
    setLoading(action);
    try {
      await fn(...args);
      showToast(`${action} successful! ✅`);
      resetFn();
    } catch (err) {
      showToast(err.reason || err.message, 'error');
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Treasury</h2>
        <p>Manage the contract treasury</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card blue">
          <div className="stat-label">Treasury Balance</div>
          <div className="stat-value">{Number(treasuryBalance).toLocaleString()}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{tokenSymbol}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Your Balance</div>
          <div className="stat-value">{Number(balance).toLocaleString()}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{tokenSymbol}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Treasury Share</div>
          <div className="stat-value">
            {Number(treasuryBalance) > 0
              ? ((Number(treasuryBalance) / (Number(treasuryBalance) + Number(balance))) * 100).toFixed(1)
              : '0'}%
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Deposit */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📥 Deposit to Treasury</div>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (from your balance: {Number(balance).toLocaleString()} {tokenSymbol})</label>
            <input className="form-input" type="number" placeholder="0.0"
              value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
              max={balance} />
          </div>
          <button className="btn btn-primary" disabled={!depositAmount || loading === 'Deposit'}
            onClick={() => handleAction('Deposit', depositTreasury, [depositAmount], () => setDepositAmount(''))}>
            {loading === 'Deposit' ? <span className="spinner"></span> : '📥'} Deposit
          </button>
        </div>

        {/* Withdraw */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📤 Withdraw from Treasury</div>
            {!isOwner && <span className="badge badge-warning">Owner Only</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <select className="form-input" value={withdrawTo} onChange={e => setWithdrawTo(e.target.value)}>
              <option value="">Select account...</option>
              {accounts.map(a => (
                <option key={a.address} value={a.address}>
                  #{a.index} {a.address.slice(0, 10)}...
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (available: {Number(treasuryBalance).toLocaleString()} {tokenSymbol})</label>
            <input className="form-input" type="number" placeholder="0.0"
              value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
          </div>
          <button className="btn btn-success" disabled={!withdrawTo || !withdrawAmount || !isOwner || loading === 'Withdraw'}
            onClick={() => handleAction('Withdraw', withdrawTreasury, [withdrawTo, withdrawAmount], () => { setWithdrawTo(''); setWithdrawAmount(''); })}>
            {loading === 'Withdraw' ? <span className="spinner"></span> : '📤'} Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
