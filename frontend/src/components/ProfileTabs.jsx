import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ProfileTabs = ({ activeTab, onTabClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your jars page path!
  const jarsPagePath = "/jars?tab=myjars";

  const handleTabClick = (tab) => {
    if (tab === "myjars" && location.pathname !== jarsPagePath) {
      navigate(jarsPagePath);
    }
    onTabClick(tab);
  };

  return (
    <div className="catalog-tabs">
      <span
        className={`catalog-tab${activeTab === "me" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("me")}
      >
        Me
      </span>
      <span
        className={`catalog-tab${activeTab === "donations" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("donations")}
      >
        Donations
      </span>
      <span
        className={`catalog-tab${activeTab === "myjars" ? " catalog-tab-active" : ""}`}
        onClick={() => handleTabClick("myjars")}
      >
        My Jars
      </span>
    </div>
  );
};
