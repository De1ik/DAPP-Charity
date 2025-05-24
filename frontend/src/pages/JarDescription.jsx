import React, { useState, useEffect } from "react";
import "../css/JarDescription.css";
import { Header } from "../components/Header.jsx";
import { ProfileTabs } from "../components/ProfileTabs.jsx";
import { Footer } from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

import usdtAbi from "../abi/MockUSDT.json";
import bankAbi from "../abi/FundraisingBank.json";

import { ethers, BrowserProvider, parseUnits } from "ethers";

const DonationJar = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const jarId = params.get("jarId");

  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("jarDescription");
  const [activeInfoTab, setActiveInfoTab] = useState("description");
  const [jarData, setJarData] = useState(null);
  const [loading, setLoading] = useState(true);

  const USDT_ADDRESS = "0xBDf506f7182e54D0564930e4Ea9E2ed5e564b989";
  const FUNDRAISING_BANK_ADDRESS = "0xc3FaC5B2BFCdDa849e0140bbe93a1CDac6DC8b9e";

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "jarDescription") {
      setActiveTab("jarDescription");
    } else {
      setActiveTab("all");
    }
  }, [location.search]);

  useEffect(() => {
    if (!jarId) return;
    setLoading(true);

    fetch(`http://localhost:8080/banks/${jarId}`)
      .then((res) => res.json())
      .then((data) => {
        setJarData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading jar:", err);
        setLoading(false);
      });
  }, [jarId]);

  if (loading) {
    return <div className="donation-container"><h2>Loading...</h2></div>;
  }

  if (!jarData) {
    return <div className="donation-container"><h2>Jar not found.</h2></div>;
  }

  const {
    title,
    description,
    image = "/images/jar-blue.png",
    raised = 0,
    goal = 1000
  } = jarData;

  const progressPercent = Math.min(100, Math.floor((raised / goal) * 100));


const handleDonate = async () => {
    const amountStr = document.querySelector('input[placeholder="Write an amount *"]').value;
    const amount = parseFloat(amountStr);

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if (!window.ethereum) {
        alert("MetaMask is not available");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 1. Подключаем контракт токена
        const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
        const decimals = await usdt.decimals();
        const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

        // 2. approve разрешение банку списать токены
        const approveTx = await usdt.approve(FUNDRAISING_BANK_ADDRESS, parsedAmount);
        await approveTx.wait();

        // 3. Вызываем donate в контракте сбора
        const fundraising = new ethers.Contract(FUNDRAISING_BANK_ADDRESS, FUNDRAISING_ABI, signer);
        const donateTx = await fundraising.donate(parsedAmount);
        await donateTx.wait();

        alert("✅ Donation successful!");
    } catch (err) {
        console.error("❌ Donation failed:", err);
        alert("Donation failed. Check console for details.");
    }
    };


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
            <img src={image} alt="Donation Jar" className="jar-image" />

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="progress-text">
              {progressPercent}%<br />{raised}/{goal} SC
            </div>

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
                    <h3>{title}</h3>
                    <p>{description || "No description provided."}</p>
                  </>
                )}

                {activeInfoTab === "media" && (
                  <p><i>Media content coming soon (images, videos, etc.)</i></p>
                )}

                {activeInfoTab === "donors" && (
                  <p><i>Top donors will be displayed here.</i></p>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Make a difference with <br /> every digital coin.</h2>
            <p>
              When you donate with crypto, you’re not just giving — you’re creating
              change. Your contribution supports trusted nonprofits, and you’ll
              know exactly where your funds go.
            </p>

            <div className="donation-form">
              <select defaultValue="mUSDT">
                <option value="mUSDT">mUSDT (Mock USDT stable coin)</option>
              </select>

              <input type="text" placeholder="Write an amount *" />
              <textarea placeholder="Message to nonprofit (e.g. area of intent)" />

              <div className="privacy-options">
                <label className="radio-tile">
                  <input type="radio" name="privacy" defaultChecked />
                  <span>Stay incognito</span>
                </label>
                <label className="radio-tile">
                  <input type="radio" name="privacy" />
                  <span>Share my info</span>
                </label>
              </div>

              <div className="info-box">
                <h4>Stay Incognito or Share Your Info?</h4>
                <p>
                  You can stay incognito — or share your name, email, and address with the nonprofit.
                </p>
              </div>

              <div className="donation-summary">
                <h5>Donation Summary</h5>
                <p>In support of {title}</p>
                <div className="amount">0.00000<br /><span>Approx. $0.00 USD</span></div>
                <button className="continue-btn" onClick={handleDonate}>Continue</button>
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
