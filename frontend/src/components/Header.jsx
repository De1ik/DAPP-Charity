import React from "react";
import "../css/header.css"


export const Header = ({ onProfileClick }) => (
  <header className="header">
    <div className="logo">Our</div>
    <nav className="nav">
      <a href="/">HOME</a>
      <a href="/jars">JARS</a>
      <a href="/create-jar">CREATE JAR</a>
      <a href="/about">ABOUT</a>
      <button onClick={onProfileClick}>
        PROFILE
      </button>
    </nav>
  </header>
);