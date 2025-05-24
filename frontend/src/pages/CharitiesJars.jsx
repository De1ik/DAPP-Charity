import React, { useState, useEffect } from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import "../css/charities.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "../context/Wallet";


export const CATEGORY_IMAGE_MAP = {
  Health: "/images/jar-red.png",
  Animals: "/images/jar-blue.png",
  Environment: "/images/jar-green.png"
};
export const DEFAULT_IMAGE = "/images/jar-blue.png";

export const STATUS_ENUM_NAMES = [
  "Active",
  "Cancelled",
  "Completed",
  "Expired",
  "FinalizedEarly",
  "AwaitingDecision",
  "Confirmed",
  "Rejected",
  "FundsTransferred",
  "ReportSubmitted",
  "Verified",
  "VoteExpired"
];

function convertStatus(status) {
  if (typeof status === "number" && status >= 0 && status < STATUS_ENUM_NAMES.length) {
    return STATUS_ENUM_NAMES[status];
  }
  return "Active";
}

export const CharitiesJarsPage = () => {
  const [loading, setLoading] = useState(true);
  const [jars, setJars] = useState([]);
  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("myjars");
  const [showOnlyMine, setShowOnlyMine] = useState(false);


  const { wallet } = useWallet();
  const location = useLocation()
  const navigate = useNavigate()


  const navigateToDonate = (jarId) => {
    if (!jarId) return;
    navigate(`/jarDescription?jarId=${jarId}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "myjars") {
      setActiveTab("myjars");
      setShowOnlyMine(true);
    } else {
      setShowOnlyMine(false);
      setActiveTab("all");
    }
  }, [location.search]);


useEffect(() => {
  setLoading(true);
  fetch("http://localhost:8080/banks")
    .then(res => res.json())
    .then(data => {
      const normalized = Array.isArray(data)
        ? data.map(jar => {
            const status = convertStatus(jar.status);
            let image = jar.image;
            if (!image || image === "ipfs://null") {
              image = CATEGORY_IMAGE_MAP[jar.category] || DEFAULT_IMAGE;
            } else if (image.startsWith("ipfs://")) {
              image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
            }
            return {
              ...jar,
              status,
              image
            };
          })
        : [];
      setJars(normalized);
      setLoading(false);
    })
    .catch(() => {
      setJars([]);
      setLoading(false);
    });
}, []);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowOnlyMine(tab === "myjars");
  };


  let jarsToShow = jars;
  if (showOnlyMine && wallet) {
    jarsToShow = jars.filter(jar =>
      jar.owner && jar.owner.toLowerCase() === wallet.toLowerCase()
    );
  }

  return (
    <div className="charities-catalog">
      <Header onProfileClick={() => setShowProfileTabs(s => !s)} />
      {showProfileTabs && (
        <ProfileTabs
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      )}
      <div className="div-4" >
        <div className="charities-grid">
          {loading ? (
            <div style={{ color: "#fff", gridColumn: "span 3", textAlign: "center" }}>Loading...</div>
          ) : jarsToShow.length === 0 ? (
            <div style={{
              color: "#fff",
              gridColumn: "span 3",
              textAlign: "center",
              padding: "2rem 0",
              opacity: 0.7
            }}>
              {showOnlyMine
                ? "You haven't created any fundraisers yet."
                : "No fundraisers found."}
            </div>
          ) : (
            jarsToShow.map((charity, i) => (
              <CharityCard

              key={i}
              image={charity.image}
              title={charity.name}
              description={charity.description}
              status={charity.status}
              onDonate={() => navigateToDonate(charity.id)}
            />
            ))
          )}
        </div>

        <div className="catalog-view-more-wrapper">
          <button className="catalog-view-more">View more</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
