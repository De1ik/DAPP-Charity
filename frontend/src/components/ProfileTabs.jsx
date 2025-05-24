import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWallet } from "../context/Wallet";

async function getMetamaskAddress() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}


export const ProfileTabs = ({ activeTab, onTabClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet, connectWallet } = useWallet();

  const jarsPagePath = "/jars?tab=myjars";

  const handleTabClick = async (tab) => {
    if (tab === "me") {
      if (!wallet) {
        await connectWallet();
        return;
      }
      try {
        const res = await fetch("http://localhost:8080/auth/check-nft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: wallet }),
        });
        const data = await res.json();
        if (data.access) {
          if (location.pathname !== "/profile") navigate("/profile");
        } else {
          navigate("/register");
        }
      } catch (err) {
        navigate("/register");
      }
    } else if (tab === "myjars" && location.pathname !== "/jars") {
      navigate(jarsPagePath);
    }
    onTabClick(tab);
  };

  return (
    <div className="catalog-tabs">
      <span
        className={`catalog-tab${activeTab === "me" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("me")}
      >
        Me
      </span>
      <span
        className={`catalog-tab${activeTab === "donations" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("donations")}
      >
        Donations
      </span>
      <span
        className={`catalog-tab${activeTab === "myjars" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("myjars")}
      >
        My Jars
      </span>
    </div>
  );
};
