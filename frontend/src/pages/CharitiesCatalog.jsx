import React from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import "../css/charities.css"
import { useLocation, useNavigate } from "react-router-dom";

const USER_NAME = "John Doe";

const charities = [
  {
    title: "Paws for Hope",
    image: "/images/jar-blue.png",
    description: "...",
    buttonColor: "#1DB4FF",
    status: "waiting_approval",
    owner: "John Doe"
  },
  {
    title: "Wildlife Haven Alliance",
    image: "/images/jar-blue.png",
    description: "...",
    buttonColor: "#1DB4FF",
    status: "waiting",
    owner: "Jane Smith"
  },
  {
    title: "Farm Friend Foundation",
    image: "/images/jar-blue.png",
    description: "...",
    buttonColor: "#1DB4FF",
    status: "canceled",
    owner: "John Doe"
  },
  {
    title: "Healing Hands Network",
    image: "/images/jar-red.png",
    description: "...",
    buttonColor: "#FF1C1C",
    status: "finished",
    owner: "Alice Johnson"
  }
];



export const CharitiesCatalogPage = () => {
  const [loading] = useState(false);
  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("myjars");
  const [showOnlyMine, setShowOnlyMine] = useState(false); // Start by showing only user's jars

  const location = useLocation()
  const navigate = useNavigate()

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowOnlyMine(tab === "myjars");
  };

  let visibleCharities = charities;
  if (showOnlyMine) {
    visibleCharities = charities.filter(c => c.owner === USER_NAME);
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
      <div className="div-4">
        <div className="charities-grid">
          {loading ? (
            <div style={{ color: "#fff", gridColumn: "span 3", textAlign: "center" }}>Loading...</div>
          ) : (
            visibleCharities.map((charity, i) => (
              <CharityCard key={i} {...charity} />
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
