import React from "react";
import { useLocation } from "react-router-dom"; // if you use react-router

export const ProfileTabs = () => {
  const location = useLocation();
  return (
    <div className="catalog-tabs">
      <a
        className={`catalog-tab${location.pathname === "/me" ? " catalog-tab-active" : ""}`}
        href="/me"
        style={{ textDecoration: "none" }}
      >
        Me
      </a>
      <a
        className={`catalog-tab${location.pathname === "/donations" ? " catalog-tab-active" : ""}`}
        href="/donations"
        style={{ textDecoration: "none" }}
      >
        Donations
      </a>
      <a
        className={`catalog-tab${location.pathname === "/my-jars" ? " catalog-tab-active" : ""}`}
        href="/my-jars"
        style={{ textDecoration: "none" }}
      >
        My Jars
      </a>
    </div>
  );
};
