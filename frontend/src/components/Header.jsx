import React from "react";
import "../css/header.css";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/Wallet";

export const Header = ({ onProfileClick }) => {
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const handleProfileOrRegister = () => {
    if (!wallet) {
      navigate("/register");
    } else if (onProfileClick) {
      onProfileClick();
    }
  };

  // Функция для красивого отображения адреса
  const shortAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

  return (
    <header className="header">
      <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Our
      </div>
      <nav className="nav">
        <a href="/">HOME</a>
        <a href="/jars">JARS</a>
        <a href="/create-jar">CREATE JAR</a>
        <a href="/about">ABOUT</a>
        <button onClick={handleProfileOrRegister}>
          {wallet
            ? <>PROFILE <span style={{
                background: "#41b9e4",
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                padding: "2px 8px",
                marginLeft: 10
              }}>{shortAddress(wallet)}</span></>
            : "REGISTER"}
        </button>
      </nav>
    </header>
  );
};
