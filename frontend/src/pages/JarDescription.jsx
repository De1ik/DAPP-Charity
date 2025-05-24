import React from "react";
import "../css/JarDescription.css";
import { Header } from "../components/Header.jsx";
import {ProfileTabs} from "../components/ProfileTabs.jsx";
import { useState, useEffect } from "react";
import {Footer} from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

const DonationJar = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const jarId = params.get("jarId");
    const [showProfileTabs, setShowProfileTabs] = useState(false);
    const [activeTab, setActiveTab] = useState("jarDescription");
    const [showOnlyMine, setShowOnlyMine] = useState(false);
    const [activeInfoTab, setActiveInfoTab] = useState("description");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setShowOnlyMine(tab === "jarDescription");
    };
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab === "jarDescription") {
            setActiveTab("jarDescription");
            setShowOnlyMine(true);
        } else {
            setShowOnlyMine(false);
            setActiveTab("all");
        }
    }, [location.search]);

    return (
        <>
        <Header onProfileClick={() => setShowProfileTabs(s => !s)} />
        {showProfileTabs && (
            <ProfileTabs
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
        )}

        <div className="donation-container">


            <main className="donation-content">
                <div className="jar-section">
                    <img
                        src="../../public/images/jar-blue.png"
                        alt="Donation Jar"
                        className="jar-image"
                    />
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width: "67%"}}></div>
                    </div>
                    <div className="progress-text">67%<br/>1500/2700 SC</div>

                    <div className="jar-description-tabs">
                        <div className="tabs">
                            <button
                                className={activeInfoTab === "description" ? "active" : ""}
                                onClick={() => setActiveInfoTab("description")}
                            >
                                Description
                            </button>
                            <button
                                className={activeInfoTab === "media" ? "active" : ""}
                                onClick={() => setActiveInfoTab("media")}
                            >
                                Media
                            </button>
                            <button
                                className={activeInfoTab === "donors" ? "active" : ""}
                                onClick={() => setActiveInfoTab("donors")}
                            >
                                Top donors
                            </button>
                        </div>

                        <div className="jar-description-content">
                            {activeInfoTab === "description" && (
                                <>
                                    <h3>Paws for Hope</h3>
                                    <p>
                                        Paws for Hope is a non-profit animal welfare organization committed to rescuing abandoned and neglected animals from the streets. It operates a network of foster homes and no-kill shelters that provide medical care, rehabilitation, and love to animals in need. Volunteers work around the clock to ensure every dog and cat gets a second chance at life. The organization also runs spay/neuter programs to control overpopulation in urban and rural areas. Through educational outreach, Paws for Hope teaches communities about responsible pet ownership. Its long-term mission is to build a world where no animal suffers from abandonment or abuse.
                                    </p>
                                </>
                            )}

                            {activeInfoTab === "media" && (
                                <>
                                    <h3>Paws Media</h3>
                                    <p><i>Media content coming soon (images, videos, etc.)</i></p>
                                </>
                            )}

                            {activeInfoTab === "donors" && (
                                <>
                                    <h3>Paws Donors</h3>
                                    <p><i>Top donors will be displayed here.</i></p>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                <div className="form-section">
                    <h2>
                        Make a difference with <br/> every digital coin.
                    </h2>
                    <p>
                        When you donate with crypto, you’re not just giving — you’re creating
                        change. Your contribution supports trusted nonprofits, and you’ll
                        know exactly where your funds go. Your crypto can make a real
                        difference.
                        <br/>Transparency, purpose, and impact — all in one transaction.
                    </p>

                    <div className="donation-form">
                        <select defaultValue="mUSDT">
                            <option value="mUSDT">mUSDT (Mock USDT stable coin)</option>
                        </select>

                        <input type="text" placeholder="Write an amount *"/>
                        <textarea placeholder="Message to nonprofit (e.g. area of intent)"/>

                        <div className="privacy-options">
                            <label className="radio-tile">
                                <input type="radio" name="privacy" defaultChecked/>
                                <span>Stay incognito</span>
                            </label>
                            <label className="radio-tile">
                                <input type="radio" name="privacy"/>
                                <span>Share my info</span>
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


        </div>
        <Footer />
        </>
    );
};

export default DonationJar;
