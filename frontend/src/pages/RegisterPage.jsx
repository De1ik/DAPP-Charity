import React, { useState } from "react";
import "../css/register.css";
import { ethers } from 'ethers';
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { ProfileTabs } from "../components/ProfileTabs";
import { BrowserProvider } from "ethers";

export const RegisterPage = () => {
  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [address, setAddress] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    if (err?.code === 4001 || err?.info?.error?.code === 4001) {
      setResponse({ error: "MetaMask connection was cancelled. Please approve to continue." });
    } else if (err?.message?.toLowerCase().includes("metamask")) {
      setResponse({ error: "MetaMask is not installed. Please install MetaMask and try again." });
    } else if (typeof err === 'string' && err.includes('MetaMask')) {
      setResponse({ error: err });
    } else {
      setResponse({ error: err?.message || "An unexpected error occurred." });
    }
  };

  const loginWithMetaMask = async () => {
    setLoading(true);
    setResponse(null);
    try {
      if (!window.ethereum) {
        setResponse({ error: "MetaMask is not installed. Please install MetaMask and try again." });
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      let signer, userAddress, message, signature;

      try {
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
      } catch (err) {
        handleError(err);
        setLoading(false);
        return;
      }

      try {
        message = `Login attempt at ${new Date().toISOString()}`;
        signature = await signer.signMessage(message);
      } catch (err) {
        handleError(err);
        setLoading(false);
        return;
      }

      const verifyRes = await fetch('http://localhost:8080/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress, message, signature }),
      });
      const verifyResult = await verifyRes.json();
      if (!verifyResult.success) {
        setResponse({ error: "Signature verification failed" });
        setLoading(false);
        return;
      }
      setAddress(userAddress);

      const nftRes = await fetch('http://localhost:8080/auth/check-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress }),
      });
      const nftResult = await nftRes.json();

      if (nftResult.access) {
        setResponse({ message: "✅ You already have access NFT!" });
        setLoading(false);
        return;
      }

      const mintRes = await fetch('http://localhost:8080/auth/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress }),
      });
      const mintResult = await mintRes.json();
      if (mintResult.success) {
        setResponse({ message: "🎉 NFT minted and access granted!", txHash: mintResult.txHash });
      } else {
        setResponse({ error: mintResult.error || "NFT mint failed" });
      }
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   const checkConnectedWallet = async () => {
  //     if (typeof window.ethereum !== "undefined") {
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const accounts = await provider.listAccounts();
  //       if (accounts.length > 0) {
  //         setAddress(accounts[0].address); // или accounts[0] если адрес строка
  //       }
  //     }
  //   };
  //   checkConnectedWallet();
  // }, []);

  return (
    <div className="register-page">
      <Header onProfileClick={() => setShowProfileTabs(s => !s) } />

      {showProfileTabs && <ProfileTabs onClose={() => setShowProfileTabs(false)} /> }

      <main className="main-content">
        <h1>
          <span className="crypto">Crypto</span>{" "}
          <span className="jarity">JARity</span>
        </h1>
        {address ? (
          <div style={{ fontSize: 18, marginTop: 24 }}>
            ✅ Connected:{" "}
            <span style={{ fontWeight: 600, color: "#41b9e4" }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        ) : (
          <button className="connect-button" onClick={loginWithMetaMask} disabled={loading}>
            {loading ? "Processing..." : "Connect MetaMask wallet"}
          </button>
        )}
        {response && (
          <div
            style={{
              marginTop: 24,
              fontSize: 18,
              borderRadius: 12,
              padding: "18px 24px",
              background: response.error ? "#ffe6e6" : "#e6fff6",
              color: response.error ? "#c0392b" : "#2d8659",
              boxShadow: "0 2px 16px #0002",
              maxWidth: 400,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            {response.message && <div>{response.message}</div>}
            {response.txHash && (
              <div style={{ marginTop: 6 }}>
                <span>Tx: </span>
                <a
                  href={`https://goerli.etherscan.io/tx/${response.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#41b9e4" }}
                >
                  {response.txHash.slice(0, 8)}...
                </a>
              </div>
            )}
            {response.error && <div>{response.error}</div>}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
