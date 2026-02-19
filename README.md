<div align="center">

# 🐾 PawChain

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-FFF100?logo=hardhat&logoColor=black)](https://hardhat.org/)
[![ethers.js](https://img.shields.io/badge/ethers.js-6-2535A0?logo=ethereum&logoColor=white)](https://docs.ethers.org/v6/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-12%20passing-brightgreen.svg)](#-run-tests)

**A full-stack Web3 smart contract dashboard with ERC20 token management, treasury controls, and dark-themed React UI — powered by a local Hardhat blockchain.**

[Report Bug](https://github.com/alfredang/pawchain/issues) · [Request Feature](https://github.com/alfredang/pawchain/issues)

</div>

---

## Screenshot

<!-- Add a screenshot of your app here -->
<!-- ![Screenshot](screenshot.png) -->

## About

PawChain is a complete Web3 application featuring **PawToken (PAW)** — an ERC20 token with built-in treasury management, role-based access control, and on-chain transaction history. It comes with a sleek dark-themed React dashboard for managing all smart contract operations.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🪙 **ERC20 Token** | Transfer, mint, and burn PAW tokens |
| 🏦 **Treasury** | Deposit/withdraw tokens from contract treasury |
| ⚙️ **Admin Controls** | Role-based access (owner/admin), pause/resume |
| 📜 **Transaction History** | On-chain transaction log with type tracking |
| 🔄 **Account Switcher** | Switch between 10 local Hardhat accounts |
| 🌙 **Dark Theme** | Sleek dark UI with gradient accents |
| ✅ **12 Unit Tests** | Full test coverage with Hardhat + Chai |

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Smart Contract | Solidity 0.8.24 | ERC20 token + treasury logic |
| Blockchain | Hardhat 2.x | Local development node |
| Frontend | React 19 | Dashboard UI |
| Build Tool | Vite 7 | Fast HMR + production builds |
| Web3 | ethers.js v6 | Blockchain interaction |
| Styling | Custom CSS | Dark theme, responsive |
| Testing | Hardhat + Chai | Smart contract unit tests |

## Architecture

```
┌─────────────────────────────────────────────┐
│                 React Dashboard              │
│  ┌─────────┬──────────┬──────────┬────────┐ │
│  │Dashboard│  Tokens  │ Treasury │ Admin  │ │
│  └────┬────┴────┬─────┴────┬─────┴───┬────┘ │
│       └─────────┴──────────┴─────────┘       │
│                useContract Hook               │
│                 (ethers.js v6)                │
└──────────────────┬──────────────────────────-┘
                   │ JSON-RPC
┌──────────────────▼──────────────────────────-┐
│              Hardhat Local Node               │
│              (http://127.0.0.1:8545)          │
│  ┌─────────────────────────────────────────┐ │
│  │           PawToken.sol (ERC20)          │ │
│  │  • transfer / approve / transferFrom    │ │
│  │  • mint / burn (admin)                  │ │
│  │  • treasury deposit / withdraw          │ │
│  │  • pause / resume                       │ │
│  │  • on-chain transaction history         │ │
│  └─────────────────────────────────────────┘ │
│         20 accounts × 10,000 ETH each        │
└──────────────────────────────────────────────┘
```

## Project Structure

```
pawchain/
├── contracts/
│   └── PawToken.sol              # ERC20 token + treasury contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── test/
│   └── PawToken.js               # 12 unit tests
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx              # Entry point
│       ├── App.jsx               # Main app with sidebar navigation
│       ├── styles.css            # Dark theme styles
│       ├── hooks/
│       │   └── useContract.js    # Web3 connection & contract calls
│       ├── pages/
│       │   ├── Dashboard.jsx     # Overview stats & account balances
│       │   ├── Tokens.jsx        # Transfer, mint, burn operations
│       │   ├── Treasury.jsx      # Deposit/withdraw treasury
│       │   ├── Transactions.jsx  # Transaction history table
│       │   └── Admin.jsx         # Access control & pause/resume
│       └── contracts/
│           ├── PawToken.json     # ABI (auto-generated)
│           └── deployment.json   # Deploy address (auto-generated)
├── hardhat.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/alfredang/pawchain.git
cd pawchain

# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Running Locally

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start dashboard
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 🧪 Run Tests

```bash
npx hardhat test
```

```
  PawToken
    Deployment
      ✔ should set correct name and symbol
      ✔ should assign total supply to owner
      ✔ should set deployer as owner
    Transfers
      ✔ should transfer tokens
      ✔ should fail if insufficient balance
    Minting
      ✔ should allow admin to mint
      ✔ should reject non-admin mint
    Burning
      ✔ should burn tokens
    Treasury
      ✔ should deposit to treasury
      ✔ should withdraw from treasury
    Pause
      ✔ should pause and unpause
    Transactions
      ✔ should record transactions

  12 passing
```

## 📊 Dashboard Pages

| Page | Description |
|------|-------------|
| **📊 Dashboard** | Token stats, contract info, recent activity, account balances with share % |
| **🪙 Tokens** | Transfer between accounts, mint (admin), burn tokens |
| **🏦 Treasury** | Deposit to and withdraw from contract treasury |
| **📜 Transactions** | Full on-chain transaction history with type badges |
| **⚙️ Admin** | Pause/resume contract, add/remove admin roles |

## 🔐 Smart Contract — PawToken.sol

| Function | Access | Description |
|----------|--------|-------------|
| `transfer` | Public | Transfer tokens to another address |
| `approve` / `transferFrom` | Public | ERC20 allowance mechanism |
| `mint` | Admin | Create new tokens |
| `burn` | Public | Destroy tokens from caller's balance |
| `depositToTreasury` | Admin | Move tokens to treasury |
| `withdrawFromTreasury` | Owner | Withdraw tokens from treasury |
| `addAdmin` / `removeAdmin` | Owner | Manage admin roles |
| `setPaused` | Owner | Pause/resume all operations |
| `getTransactions` | View | Paginated transaction history |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Developed By

**Dr Alfred Ang** — [@alfredang](https://github.com/alfredang)

## Acknowledgements

- [Hardhat](https://hardhat.org/) — Ethereum development environment
- [ethers.js](https://docs.ethers.org/v6/) — Web3 library
- [React](https://react.dev/) — UI framework
- [Vite](https://vite.dev/) — Build tool
- [OpenZeppelin](https://www.openzeppelin.com/) — Smart contract standards inspiration

---

<div align="center">

⭐ Star this repo if you found it useful!

</div>
