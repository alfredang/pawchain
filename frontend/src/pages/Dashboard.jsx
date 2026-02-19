import React from 'react';

function formatNum(n) {
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function shortenAddr(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
}

export default function Dashboard({
  tokenName, tokenSymbol, totalSupply, balance,
  treasuryBalance, owner, isPaused, account,
  transactions, accounts,
}) {
  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your smart contract</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Supply</div>
          <div className="stat-value">{formatNum(totalSupply)}</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>{tokenSymbol}</div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Your Balance</div>
          <div className="stat-value">{formatNum(balance)}</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>{tokenSymbol}</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-label">Treasury</div>
          <div className="stat-value">{formatNum(treasuryBalance)}</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>{tokenSymbol}</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-label">Status</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {isPaused ? '⏸️ Paused' : '✅ Active'}
          </div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>Contract</div>
        </div>
      </div>

      {/* Info + Recent Transactions */}
      <div className="grid-2">
        {/* Contract Info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Contract Info</div>
          </div>
          <table>
            <tbody>
              <tr><td style={{ color: 'var(--text-muted)' }}>Name</td><td>{tokenName}</td></tr>
              <tr><td style={{ color: 'var(--text-muted)' }}>Symbol</td><td>{tokenSymbol}</td></tr>
              <tr><td style={{ color: 'var(--text-muted)' }}>Owner</td><td><span className="address">{shortenAddr(owner)}</span></td></tr>
              <tr><td style={{ color: 'var(--text-muted)' }}>Your Address</td><td><span className="address">{shortenAddr(account)}</span></td></tr>
              <tr><td style={{ color: 'var(--text-muted)' }}>Transactions</td><td>{transactions.length}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              No transactions yet
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>From/To</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((tx, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`badge badge-${
                          tx.txType === 'mint' ? 'success' :
                          tx.txType === 'burn' ? 'danger' :
                          tx.txType === 'deposit' ? 'warning' :
                          tx.txType === 'withdraw' ? 'info' : 'info'
                        }`}>
                          {tx.txType}
                        </span>
                      </td>
                      <td>{formatNum(tx.amount)} {tokenSymbol}</td>
                      <td><span className="address">{shortenAddr(tx.to)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top Holders */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">Account Balances</div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Address</th>
                <th>Balance ({tokenSymbol})</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter(a => Number(a.balance) > 0)
                .sort((a, b) => Number(b.balance) - Number(a.balance))
                .map((acc, i) => (
                  <tr key={acc.address}>
                    <td>{i + 1}</td>
                    <td><span className="address">{shortenAddr(acc.address)}</span></td>
                    <td>{formatNum(acc.balance)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          height: 6, borderRadius: 3, background: 'var(--accent)',
                          width: `${Math.min((Number(acc.balance) / Number(totalSupply)) * 100, 100)}%`,
                          maxWidth: 120,
                        }}></div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {((Number(acc.balance) / Number(totalSupply)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
