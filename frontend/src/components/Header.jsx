import React from "react";
import "../css/header.css"
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/Wallet";

export const Header = ({ onProfileClick }) => {
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const handleProfileOrRegister = () => {
    if (!wallet)
      navigate("/register");
    if (onProfileClick) onProfileClick();
  };

  return (
    <header className="header">
      <div className="logo">Our</div>
      <nav className="nav">
        <a href="/">HOME</a>
        <a href="/jars">JARS</a>
        <a href="/create-jar">CREATE JAR</a>
        <a href="/about">ABOUT</a>
        <button onClick={handleProfileOrRegister}>
          {wallet ? "PROFILE" : "REGISTER"}
        </button>
      </nav>
    </header>
  );
};
