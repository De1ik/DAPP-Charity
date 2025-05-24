import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import "../css/userProfile.css";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/Wallet.jsx";


export const UserProfile = () => {
  const navigate = useNavigate();
  const { wallet, connectWallet } = useWallet();
  const [hasNft, setHasNft] = useState(null);
  const [showProfileTabs, setShowProfileTabs] = useState(false);

  const donated = "9,605.37 USDT";
  const reputation = 100;

  useEffect(() => {
    async function checkNft(address) {
      try {
        const res = await fetch("http://localhost:8080/auth/check-nft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        const data = await res.json();
        setHasNft(data.access);
        if (!data.access) navigate("/register");
      } catch (e) {
        setHasNft(false);
        navigate("/register");
      }
    }
    if (wallet) checkNft(wallet);
    else if (wallet === null) navigate("/register");
  }, [wallet, navigate]);

  if (wallet === undefined || hasNft === null) return <div>Loading...</div>;
  if (!hasNft) return null;


  return (
    <div className="user-profile">
      <Header onProfileClick={() => setShowProfileTabs(s => !s)} />
      {showProfileTabs && <ProfileTabs activeTab="me" onTabClick={() => {}} />}
      <div className="profile-main-content">
        <div className="gradient-text profile-label">Wallet Address</div>
        <div className="profile-wallet">{wallet}</div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-label gradient-text">Donated total</div>
            <div className="profile-stat-value">{donated}</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-label gradient-text">Reputation</div>
            <div className="profile-stat-value points">{reputation} pts</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
