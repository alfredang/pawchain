import React, { useState } from 'react';

export default function Tokens({ balance, tokenSymbol, accounts, transfer, mint, burn, account, owner, showToast }) {
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
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
        <h2>Token Management</h2>
        <p>Transfer, mint, and burn {tokenSymbol} tokens</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="stat-card green">
          <div className="stat-label">Your Balance</div>
          <div className="stat-value">{Number(balance).toLocaleString()}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{tokenSymbol}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Role</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{isOwner ? '👑 Owner' : '👤 User'}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Transfer */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📤 Transfer Tokens</div>
          </div>
          <div className="form-group">
            <label className="form-label">Recipient Address</label>
            <select className="form-input" value={transferTo} onChange={e => setTransferTo(e.target.value)}>
              <option value="">Select account...</option>
              {accounts.filter(a => a.address !== account).map(a => (
                <option key={a.address} value={a.address}>
                  #{a.index} {a.address.slice(0, 10)}... ({Number(a.balance).toLocaleString()} {tokenSymbol})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input className="form-input" type="number" placeholder="0.0"
              value={transferAmount} onChange={e => setTransferAmount(e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={!transferTo || !transferAmount || loading === 'Transfer'}
            onClick={() => handleAction('Transfer', transfer, [transferTo, transferAmount], () => { setTransferTo(''); setTransferAmount(''); })}>
            {loading === 'Transfer' ? <span className="spinner"></span> : '📤'} Transfer
          </button>
        </div>

        {/* Mint */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🪙 Mint Tokens</div>
            {!isOwner && <span className="badge badge-warning">Admin Only</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <select className="form-input" value={mintTo} onChange={e => setMintTo(e.target.value)}>
              <option value="">Select account...</option>
              {accounts.map(a => (
                <option key={a.address} value={a.address}>
                  #{a.index} {a.address.slice(0, 10)}...
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input className="form-input" type="number" placeholder="0.0"
              value={mintAmount} onChange={e => setMintAmount(e.target.value)} />
          </div>
          <button className="btn btn-success" disabled={!mintTo || !mintAmount || loading === 'Mint'}
            onClick={() => handleAction('Mint', mint, [mintTo, mintAmount], () => { setMintTo(''); setMintAmount(''); })}>
            {loading === 'Mint' ? <span className="spinner"></span> : '🪙'} Mint
          </button>
        </div>
      </div>

      {/* Burn */}
      <div className="card" style={{ marginTop: 24, maxWidth: '50%' }}>
        <div className="card-header">
          <div className="card-title">🔥 Burn Tokens</div>
        </div>
        <div className="form-group">
          <label className="form-label">Amount to burn from your balance</label>
          <input className="form-input" type="number" placeholder="0.0"
            value={burnAmount} onChange={e => setBurnAmount(e.target.value)} />
        </div>
        <button className="btn btn-danger" disabled={!burnAmount || loading === 'Burn'}
          onClick={() => handleAction('Burn', burn, [burnAmount], () => setBurnAmount(''))}>
          {loading === 'Burn' ? <span className="spinner"></span> : '🔥'} Burn
        </button>
      </div>
    </div>
  );
}
