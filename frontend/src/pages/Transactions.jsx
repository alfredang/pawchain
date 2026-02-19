import React from 'react';

function shortenAddr(addr) {
  if (!addr || addr === '0x0000000000000000000000000000000000000000') return '🔥 Null';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
}

const TYPE_CONFIG = {
  transfer: { badge: 'info', icon: '📤' },
  mint: { badge: 'success', icon: '🪙' },
  burn: { badge: 'danger', icon: '🔥' },
  deposit: { badge: 'warning', icon: '📥' },
  withdraw: { badge: 'info', icon: '📤' },
};

export default function Transactions({ transactions, tokenSymbol, refreshData }) {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Transaction History</h2>
          <p>{transactions.length} transactions recorded on-chain</p>
        </div>
        <button className="btn btn-outline" onClick={refreshData}>🔄 Refresh</button>
      </div>

      <div className="card">
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
            <p>No transactions yet. Start by minting or transferring tokens!</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => {
                  const cfg = TYPE_CONFIG[tx.txType] || { badge: 'info', icon: '📋' };
                  return (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <span className={`badge badge-${cfg.badge}`}>
                          {cfg.icon} {tx.txType}
                        </span>
                      </td>
                      <td><span className="address">{shortenAddr(tx.from)}</span></td>
                      <td><span className="address">{shortenAddr(tx.to)}</span></td>
                      <td style={{ fontWeight: 600 }}>
                        {Number(tx.amount).toLocaleString()} {tokenSymbol}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {formatTime(tx.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
