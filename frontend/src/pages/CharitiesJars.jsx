import React from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import "../css/charities.css"
import { useLocation, useNavigate } from "react-router-dom";

// Replace with the real user address after login
const USER_ADDRESS = "0x123...abc".toLowerCase(); // For demo, or get from wallet/session

const USER_NAME = "John Doe"; // fallback for static

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



export const CharitiesJarsPage = () => {
  const [loading, setLoading] = useState(true);
  const [jars, setJars] = useState([]);
  const [showProfileTabs, setShowProfileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("myjars");
  const [showOnlyMine, setShowOnlyMine] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/banks")
      .then(res => res.json())
      .then(data => {
        setJars(Array.isArray(data) ? data : []);
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

  let jarsToShow = jars.length === 0 ? charities : jars;

  if (showOnlyMine) {
    if (jars.length === 0) {
      jarsToShow = charities.filter(jar => jar.owner === USER_NAME);
    } else {
      jarsToShow = jars.filter(jar =>
        (jar.owner && jar.owner.toLowerCase() === USER_ADDRESS)
      );
    }
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
            jarsToShow.map((charity, i) => (
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
