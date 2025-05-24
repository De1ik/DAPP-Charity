import React, { useState, useEffect } from "react";
import "../css/JarDescription.css";
import { Header } from "../components/Header.jsx";
import { ProfileTabs } from "../components/ProfileTabs.jsx";
import { Footer } from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import FundraiserSummaryStats from './components/FundraiserSummaryStats.jsx';
import { CATEGORY_IMAGE_MAP } from "./CharitiesJars.jsx";
import { DEFAULT_IMAGE } from "./CharitiesJars.jsx";
import { statusMap } from "../components/charity/CharityCard.jsx";

import usdtAbi from "../abi/MockUSDT.json";
import bankAbi from "../abi/FundraisingBank.json";

import { ethers, BrowserProvider, parseUnits } from "ethers";

function getJarImage(jar) {
  if (!jar.image || jar.image === "ipfs://null") {
    return CATEGORY_IMAGE_MAP[jar.category] || DEFAULT_IMAGE;
  }
  if (jar.image.startsWith("ipfs://")) {
    return jar.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return jar.image;
}

const DonationJar = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const jarId = params.get("jarId");

  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("jarDescription");

  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState("description");
  const [jar, setJar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/banks/${jarId}`)
      .then(res => res.json())
      .then(data => {
        setJar(data);
        setLoading(false);
      })
      .catch(() => {
        setJar(null);
        setLoading(false);
      });
  }, [jarId]);

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
    
    useEffect(() => {
        document.body.classList.add('donation-body');
        return () => {
            document.body.classList.remove('donation-body');
        };
    }, []);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowOnlyMine(tab === "jarDescription");
  };

  if (loading) {
    return (
      <>
        <Header onProfileClick={() => setShowProfileTabs(s => !s)} />
        <div className="donation-container">
          <main className="donation-content">
            <div style={{ color: "#fff", textAlign: "center", width: "100%" }}>Loading...</div>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  if (!jar) {
    return (
      <>
        <Header onProfileClick={() => setShowProfileTabs(s => !s)} />
        <div className="donation-container">
          <main className="donation-content">
            <div style={{ color: "#fff", textAlign: "center", width: "100%" }}>
              Fundraiser not found.
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  const badge = statusMap[jar.status] || null;
  const jarImage = getJarImage(jar);

  const progress = jar.goal && jar.raised
    ? Math.round((jar.raised / jar.goal) * 100)
    : 0;
  const progressText = `${progress}%\n${jar.raised || 0}/${jar.goal || 0} SC`;

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
            {badge && (
              <div
                className="charity-status-badge"
                style={{
                  background: badge.color,
                  color: badge.textColor,
                  marginBottom: 16,
                  alignSelf: "center"
                }}
              >
                {badge.text}
              </div>
            )}
            <img
              src={jarImage}
              alt="Donation Jar"
              className="jar-image"
            />
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: jar.goal ? `${progress}%` : "0%" }}
              ></div>
            </div>
            <div className="progress-text">
              {jar.goal ? (
                <>
                  {progress}%<br />{jar.raised || 0}/{jar.goal} SC
                </>
              ) : (
                <span>No goal set</span>
              )}
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
                    <h3>{jar.name}</h3>
                    <p>{jar.description || "No description provided."}</p>
                  </>
                )}
                {activeInfoTab === "media" && (
                  <>
                    <h3>Media</h3>
                    <p>
                      {jar.videoUrl
                        ? <a href={jar.videoUrl} target="_blank" rel="noopener noreferrer">View Video</a>
                        : <i>No media content.</i>}
                    </p>
                  </>
                )}
                {activeInfoTab === "donors" && (
                  <>
                    <h3>Top donors</h3>
                    <p><i>Top donors will be displayed here.</i></p>
                  </>
                )}
              </div>
            </div>
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
              <FundraiserSummaryStats
                stats={{
                  wallet: jar.owner,
                  canceled: 2,
                  finished: 5,
                  active: 3
                }}
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default DonationJar;
