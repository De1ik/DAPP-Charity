import React from "react";
import "../css/footer.css"

export const Footer = () => (
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
        alt="Planet logo"
        src="images/planet.png"
      />
    </div>
    <div className="copyright">
      Copyright © 2025, All rights reserved.
    </div>
  </footer>
);
