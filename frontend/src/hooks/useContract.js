import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import deployment from '../contracts/deployment.json';
import PawTokenABI from '../contracts/PawToken.json';

const LOCALHOST_URL = 'http://127.0.0.1:8545';

export function useContract() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contract state
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('0');
  const [balance, setBalance] = useState('0');
  const [treasuryBalance, setTreasuryBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [owner, setOwner] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let p, s;

      if (window.ethereum) {
        p = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        s = await p.getSigner();
      } else {
        // Connect to local Hardhat node
        p = new ethers.JsonRpcProvider(LOCALHOST_URL);
        s = await p.getSigner(0);
      }

      const c = new ethers.Contract(deployment.address, PawTokenABI.abi, s);
      const addr = await s.getAddress();

      // Get all accounts from local node
      const allAccounts = [];
      for (let i = 0; i < 10; i++) {
        try {
          const acc = await p.getSigner(i);
          const a = await acc.getAddress();
          const bal = await c.balanceOf(a);
          allAccounts.push({
            address: a,
            balance: ethers.formatEther(bal),
            index: i,
          });
        } catch {
          break;
        }
      }

      setProvider(p);
      setSigner(s);
      setContract(c);
      setAccount(addr);
      setAccounts(allAccounts);
      setConnected(true);
    } catch (err) {
      setError(err.message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!contract || !account) return;

    try {
      const [name, symbol, supply, bal, treasury, ethBal, own, paused] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
        contract.balanceOf(account),
        contract.treasuryBalance(),
        contract.getContractEthBalance(),
        contract.owner(),
        contract.paused(),
      ]);

      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(ethers.formatEther(supply));
      setBalance(ethers.formatEther(bal));
      setTreasuryBalance(ethers.formatEther(treasury));
      setEthBalance(ethers.formatEther(ethBal));
      setOwner(own);
      setIsPaused(paused);

      // Get recent transactions
      const txCount = await contract.getTransactionCount();
      const count = Number(txCount);
      if (count > 0) {
        const limit = Math.min(count, 20);
        const txs = await contract.getTransactions(0, limit);
        setTransactions(
          txs.map((tx) => ({
            from: tx.from,
            to: tx.to,
            amount: ethers.formatEther(tx.amount),
            timestamp: Number(tx.timestamp),
            txType: tx.txType,
          }))
        );
      }

      // Refresh account balances
      if (provider) {
        const updatedAccounts = [];
        for (let i = 0; i < 10; i++) {
          try {
            const acc = await provider.getSigner(i);
            const a = await acc.getAddress();
            const b = await contract.balanceOf(a);
            updatedAccounts.push({
              address: a,
              balance: ethers.formatEther(b),
              index: i,
            });
          } catch {
            break;
          }
        }
        setAccounts(updatedAccounts);
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  }, [contract, account, provider]);

  // Auto-connect and refresh
  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (connected) refreshData();
  }, [connected, refreshData]);

  // Contract actions
  const transfer = async (to, amount) => {
    const tx = await contract.transfer(to, ethers.parseEther(amount));
    await tx.wait();
    await refreshData();
  };

  const mint = async (to, amount) => {
    const tx = await contract.mint(to, ethers.parseEther(amount));
    await tx.wait();
    await refreshData();
  };

  const burn = async (amount) => {
    const tx = await contract.burn(ethers.parseEther(amount));
    await tx.wait();
    await refreshData();
  };

  const depositTreasury = async (amount) => {
    const tx = await contract.depositToTreasury(ethers.parseEther(amount));
    await tx.wait();
    await refreshData();
  };

  const withdrawTreasury = async (to, amount) => {
    const tx = await contract.withdrawFromTreasury(to, ethers.parseEther(amount));
    await tx.wait();
    await refreshData();
  };

  const addAdmin = async (address) => {
    const tx = await contract.addAdmin(address);
    await tx.wait();
    await refreshData();
  };

  const removeAdmin = async (address) => {
    const tx = await contract.removeAdmin(address);
    await tx.wait();
    await refreshData();
  };

  const togglePause = async () => {
    const tx = await contract.setPaused(!isPaused);
    await tx.wait();
    await refreshData();
  };

  const switchAccount = async (index) => {
    if (!provider) return;
    const newSigner = await provider.getSigner(index);
    const newContract = new ethers.Contract(deployment.address, PawTokenABI.abi, newSigner);
    const addr = await newSigner.getAddress();
    setSigner(newSigner);
    setContract(newContract);
    setAccount(addr);
  };

  return {
    provider, signer, contract, account, connected, loading, error,
    tokenName, tokenSymbol, totalSupply, balance, treasuryBalance,
    ethBalance, owner, isPaused, transactions, accounts,
    connect, refreshData, transfer, mint, burn,
    depositTreasury, withdrawTreasury, addAdmin, removeAdmin,
    togglePause, switchAccount,
  };
}
