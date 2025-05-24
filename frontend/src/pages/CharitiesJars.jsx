import React, { useState, useEffect } from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import "../css/charities.css";
import { useLocation, useNavigate } from "react-router-dom";

const USER_ADDRESS = "0x123...abc".toLowerCase(); // Replace with actual wallet address
const USER_NAME = "John Doe"; // Fallback name

// Static fallback if API fails
const charitiesFallback = [
  {
    id: "1",
    title: "Paws for Hope",
    image: "/images/jar-blue.png",
    description: "Help us bring hope to those in need! Every coin you drop into this jar supports food, shelter, and care for vulnerable families. Your generosity can change a life today.",
    buttonColor: "#1DB4FF",
    status: "waiting_approval",
    owner: "John Doe"
  },
  {
    id: "2",
    title: "Wildlife Haven Alliance",
    image: "/images/jar-blue.png",
    description: "Together, we can make a difference! All donations collected in this jar go directly to supporting children’s education, healthcare, and safe living conditions. Give a little—change a lot.",
    buttonColor: "#1DB4FF",
    status: "waiting",
    owner: "Jane Smith"
  },
  {
    id: "3",
    title: "Farm Friend Foundation",
    image: "/images/jar-blue.png",
    description: "Your kindness matters. Contributions to this jar will help fund critical medical treatments, warm meals, and emergency aid for those facing hard times. Every donation counts!",
    buttonColor: "#1DB4FF",
    status: "canceled",
    owner: "John Doe"
  },
  {
    id: "4",
    title: "Healing Hands Network",
    image: "/images/jar-red.png",
    description: "Small change, big impact. By supporting this charity jar, you’re helping us create brighter futures for people in need. Thank you for being a part of our mission!",
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

  const location = useLocation();
  const navigate = useNavigate();

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

  // Fetch active jars (banks) from backend
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/banks")
      .then(res => res.json())
      .then(data => {
        const activeStatuses = ["open", "active"];
        const filtered = Array.isArray(data)
          ? data.filter(jar => activeStatuses.includes(jar.status))
          : [];
        setJars(filtered);
        setLoading(false);
      })
      .catch(() => {
        setJars([]); // fallback to static if needed
        setLoading(false);
      });
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowOnlyMine(tab === "myjars");
  };

  let jarsToShow = jars.length === 0 ? charitiesFallback : jars;

  if (showOnlyMine) {
    if (jars.length === 0) {
      jarsToShow = charitiesFallback.filter(jar => jar.owner === USER_NAME);
    } else {
      jarsToShow = jars.filter(jar =>
        jar.owner && jar.owner.toLowerCase() === USER_ADDRESS
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
            <div style={{ color: "#fff", gridColumn: "span 3", textAlign: "center" }}>
              Loading...
            </div>
          ) : (
            jarsToShow.map((charity, i) => (
              <CharityCard
                key={charity.id || i}
                {...charity}
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
