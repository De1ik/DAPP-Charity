import React from "react";
import "../css/header.css"


export const Header = () => (
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
);
