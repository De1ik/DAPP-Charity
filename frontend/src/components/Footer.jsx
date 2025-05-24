import React from "react";
import "../css/footer.css";

export const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-sections">
                <div className="footer-section">
                    <div className="footer-title">FOR DONORS</div>
                    <div className="footer-link">Donate crypto</div>
                    <div className="footer-link">Explore causes</div>
                </div>
                <div className="footer-section">
                    <div className="footer-title">RESOURCES</div>
                    <div className="footer-link"
                         onClick={() => window.open("https://github.com/De1ik/DAPP-Charity", "_blank")}
                         style={{ cursor: "pointer" }}>About us</div>
                    <div className="footer-link">Terms of use</div>
                </div>
            </div>
            <img
                className="footer-logo"
                alt="Planet logo"
                src="/images/planet.png"
            />
        </div>
        <div className="copyright">
            © 2025 OurDAO. All rights reserved.
        </div>
    </footer>
);
