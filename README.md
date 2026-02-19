# 🐾 PawToken — Smart Contract Dashboard

A full-stack Web3 application featuring an ERC20 token with treasury management, deployed on a local Hardhat blockchain with a React dashboard.

## ✨ Features

- **ERC20 Token** — Transfer, mint, and burn PAW tokens
- **Treasury Management** — Deposit/withdraw tokens from contract treasury
- **Admin Controls** — Role-based access (owner/admin), pause/resume contract
- **Transaction History** — On-chain transaction log with type tracking
- **Account Switcher** — Switch between 10 local Hardhat accounts
- **Dark Theme** — Sleek dark UI with gradient accents
- **12 Unit Tests** — Full test coverage with Hardhat + Chai

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.24 |
| Blockchain | Hardhat (local node) |
| Frontend | React + Vite |
| Web3 | ethers.js v6 |
| Styling | Custom CSS (dark theme) |
| Testing | Hardhat + Chai |

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm

### Setup
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Start local blockchain
npx hardhat node

# Deploy contract (in another terminal)
npx hardhat run scripts/deploy.js --network localhost

# Start dashboard
cd frontend && npm run dev
```

### Run Tests
```bash
npx hardhat test
```

## 📁 Project Structure

```
├── contracts/
│   └── PawToken.sol          # ERC20 token + treasury contract
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── PawToken.js           # 12 unit tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app with sidebar navigation
│   │   ├── hooks/
│   │   │   └── useContract.js # Web3 connection & contract interactions
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Overview stats & account balances
│   │   │   ├── Tokens.jsx     # Transfer, mint, burn operations
│   │   │   ├── Treasury.jsx   # Deposit/withdraw treasury
│   │   │   ├── Transactions.jsx # Transaction history table
│   │   │   └── Admin.jsx      # Access control & pause/resume
│   │   └── styles.css         # Dark theme styles
│   └── vite.config.js
└── hardhat.config.js
```

## 📊 Dashboard Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Token stats, contract info, recent activity, account balances |
| **Tokens** | Transfer, mint (admin), and burn tokens |
| **Treasury** | Deposit to and withdraw from contract treasury |
| **Transactions** | Full on-chain transaction history with type badges |
| **Admin** | Pause/resume contract, add/remove admins |

## 🔐 Smart Contract

**PawToken.sol** implements:
- Full ERC20 (transfer, approve, transferFrom)
- Mint/burn with admin access control
- Treasury deposit/withdraw
- Pause mechanism
- On-chain transaction history
- Role-based access (owner + admins)

## 📝 License

MIT

---

Built with 🐾 by Paw
