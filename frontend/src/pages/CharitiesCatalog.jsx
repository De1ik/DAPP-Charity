import React from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { ProfileTabs } from "../components/ProfileTabs";
import { Footer } from "../components/Footer";
import { useState } from "react";
import "../css/charities.css"

const charities = [
  {
    "title": "Paws for Hope",
    "image": "/images/jar-blue.png",
    "description": "...",
    "buttonColor": "#1DB4FF",
    "status": "waiting_approval"
  },
  {
    "title": "Wildlife Haven Alliance",
    "image": "/images/jar-blue.png",
    "description": "...",
    "buttonColor": "#1DB4FF",
    "status": "waiting"
  },
  {
    "title": "Farm Friend Foundation",
    "image": "/images/jar-blue.png",
    "description": "...",
    "buttonColor": "#1DB4FF",
    "status": "canceled"
  },
  {
    "title": "Healing Hands Network",
    "image": "/images/jar-red.png",
    "description": "...",
    "buttonColor": "#FF1C1C",
    "status": "finished"
  }
]


export const CharitiesCatalogPage = () => {
  // const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(false)
  const [showProfileTabs, setShowProfileTabs] = useState(false);

  // useEffect(() => {
  //   fetch("/api/jars")
  //     .then(res => res.json())
  //     .then(data => {
  //       setCharities(data);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, []);

  return (
    <div className="charities-catalog">
      <Header onProfileClick={() => setShowProfileTabs(s => !s) } />
      
      {showProfileTabs && <ProfileTabs onClose={() => setShowProfileTabs(false)} /> }
      
      <div className="div-4">
        <div className="charities-grid">
          {loading ? (
            <div style={{ color: "#fff", gridColumn: "span 3", textAlign: "center" }}>Loading...</div>
          ) : (
            charities.map((charity, i) => (
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
