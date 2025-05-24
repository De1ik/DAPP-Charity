import React, { useState } from "react";
import chatgptImageMay232025015531PmRemovebgPreview1 from "../images/ChatGPT_Image_May_23__2025__01_55_31_PM-removebg-preview 1.png";
import "../css/register.css";
import { ethers } from 'ethers';

export const RegisterPage = () => {
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

  return (
    <div className="register-page">
      <header className="header">
        <div className="logo">Our</div>
        <nav className="nav">
          <a href="/">HOME</a>
          <a href="/">JARS</a>
          <a href="/">CREATE JAR</a>
          <a href="/">ABOUT</a>
          <a href="/">PROFILE</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>
          <span className="crypto">Crypto</span>{" "}
          <span className="jarity">JARity</span>
        </h1>
        <button className="connect-button" onClick={loginWithMetaMask} disabled={loading}>
          {loading ? "Processing..." : "Connect MetaMask wallet"}
        </button>
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

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-sections">
            <div>
              <div className="footer-title">FOR DONORS</div>
              <div>Donate crypto</div>
              <div>Explore causes</div>
            </div>
            <div>
              <div className="footer-title">RESOURCES</div>
              <div>About us</div>
              <div>Terms of use</div>
            </div>
          </div>
          <img
            className="footer-logo"
            alt="Chatgpt logo"
            src={chatgptImageMay232025015531PmRemovebgPreview1}
          />
        </div>
        <div className="copyright">
          Copyright © 2025, All rights reserved.
        </div>
      </footer>
    </div>
  );
};
