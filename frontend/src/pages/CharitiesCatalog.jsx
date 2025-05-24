import React from "react";
import { CharityCard } from "../components/charity/CharityCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState } from "react";
import "../css/charities.css"

const charities = [
  {
    title: "Paws for Hope",
    image: "/images/jar-blue.png",
    description:
      "A nonprofit organization dedicated to rescuing stray animals and providing medical care, shelter, and forever homes.",
    buttonColor: "#1DB4FF",
  },
  {
    title: "Wildlife Haven Alliance",
    image: "/images/jar-blue.png",
    description:
      "Protects endangered species by conserving habitats, supporting wildlife rehabilitation, and promoting biodiversity awareness.",
    buttonColor: "#1DB4FF",
  },
  {
    title: "Farm Friend Foundation",
    image: "/images/jar-blue.png",
    description:
      "A nonprofit organization dedicated to rescuing stray animals and providing medical care, shelter, and forever homes.",
    buttonColor: "#1DB4FF",
  },
  {
    title: "Healing Hands Network",
    image: "/images/jar-red.png",
    description:
      "Provides free medical services and supplies to underserved communities in remote areas around the world.",
    buttonColor: "#FF1C1C",
  },
  {
    title: "Hearts United for Mental Health",
    image: "/images/jar-red.png",
    description:
      "Supports mental health awareness and access to care through education, crisis intervention, and counseling programs.",
    buttonColor: "#FF1C1C",
  },
  {
    title: "Breath of Life Initiative",
    image: "/images/jar-red.png",
    description:
      "Focuses on respiratory health by funding research on lung diseases and providing resources for patients with chronic conditions.",
    buttonColor: "#FF1C1C",
  },
  {
    title: "Green Earth Collective",
    image: "/images/jar-green.png",
    description:
      "Make a crypto donation to support nonprofits that advocate for animals through veterinary care, adoption services, rehabilitation, conservation, and research.",
    buttonColor: "#36D988",
  },
  {
    title: "Healthcare Healthcare Healthcare Healthcare",
    image: "/images/jar-green.png",
    description:
      "Make a crypto donation to support nonprofits that advocate for animals through veterinary care, adoption services, rehabilitation, conservation, and research.",
    buttonColor: "#36D988",
  },
  {
    title: "Healthcare Healthcare Healthcare Healthcare",
    image: "/images/jar-green.png",
    description:
      "Make a crypto donation to support nonprofits that advocate for animals through veterinary care, adoption services, rehabilitation, conservation, and research.",
    buttonColor: "#36D988",
  },
];

export const CharitiesCatalogPage = () => {
  // const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(false)

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
      <Header />
      <div className="div-4">
        <div className="text-wrapper-25 catalog-header">Jars</div>
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
