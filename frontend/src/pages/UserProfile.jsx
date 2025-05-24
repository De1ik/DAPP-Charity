import React, { useState } from "react";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import "../css/userProfile.css";

export const UserProfile = () => {
    const [showProfileTabs, setShowProfileTabs] = useState(false);
  const wallet = "3T74h2ClRP93NOwAviersyiWkqpHcLYBs";
  const donated = "9,605.37 USDT";
  const reputation = 100;

  const [activeTab, setActiveTab] = useState("me");

  return (
    <div className="user-profile">
        <Header onProfileClick={() => setShowProfileTabs(s => !s) } />
      
        {showProfileTabs && <ProfileTabs onClose={() => setShowProfileTabs(false)} /> }
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
