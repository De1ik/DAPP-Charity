import React from "react";
import "./styles/JarDescription.css";

const DonationJar = () => {
    return (
        <div className="donation-container">
            <header className="navbar">
                <div className="logo">Our</div>
                <nav>
                    <a href="#">HOME</a>
                    <a href="#">JARS</a>
                    <a href="#">CREATE JAR</a>
                    <a href="#">ABOUT</a>
                    <a href="#">PROFILE</a>
                </nav>
            </header>

            <main className="donation-content">
                <div className="jar-section">
                    <img
                        src="/jar.png"
                        alt="Donation Jar"
                        className="jar-image"
                    />
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "67%" }}></div>
                    </div>
                    <div className="progress-text">67%<br />1500/2700 SC</div>
                </div>

                <div className="form-section">
                    <h2>
                        Make a difference with <br /> every digital coin.
                    </h2>
                    <p>
                        When you donate with crypto, you’re not just giving — you’re creating
                        change. Your contribution supports trusted nonprofits, and you’ll
                        know exactly where your funds go. Your crypto can make a real
                        difference.
                        <br />Transparency, purpose, and impact — all in one transaction.
                    </p>

                    <div className="donation-form">
                        <select>
                            <option>Choose a coin *</option>
                        </select>
                        <input type="text" placeholder="Write an amount *" />
                        <textarea placeholder="Message to nonprofit (e.g. area of intent)" />

                        <div className="privacy-options">
                            <label>
                                <input type="radio" name="privacy" defaultChecked /> Stay incognito
                            </label>
                            <label>
                                <input type="radio" name="privacy" /> Share my info
                            </label>
                        </div>

                        <div className="info-box">
                            <h4>Stay Incognito or Share Your Info?</h4>
                            <p>
                                You have the option to stay incognito — or to share your name, email,
                                and address with the nonprofit you’re supporting. Nonprofits often
                                collect this information to thank you personally, send tax receipts,
                                and share updates about how your donation makes a difference.
                            </p>
                        </div>

                        <div className="donation-summary">
                            <h5>Donation Summary</h5>
                            <p>In support of our Planet</p>
                            <div className="amount">0.00000<br /><span>Approx. $0.00 USD</span></div>
                            <button className="continue-btn">Continue</button>
                            <p className="terms">
                                By selecting continue, you agree to our <a href="#">terms and conditions</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <img src="/planet.png" alt="Planet" className="planet-img" />
                <p>Copyright © 2025, All rights reserved.</p>
                <div className="footer-links">
                    <div>
                        <a href="#">Home</a>
                        <a href="#">Donate crypto</a>
                        <a href="#">Explore causes</a>
                    </div>
                    <div>
                        <a href="#">FOR DONORS</a>
                        <a href="#">RESOURCES</a>
                        <a href="#">About us</a>
                        <a href="#">Terms of use</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DonationJar;
