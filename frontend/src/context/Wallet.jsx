import React, { createContext, useState, useEffect, useContext } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    async function fetchWallet() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) setWallet(accounts[0]);
      }
    }
    fetchWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWallet(accounts[0] || "");
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
