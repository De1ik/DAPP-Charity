import React from "react";

export const CharityCard = ({
  image,
  title,
  description,
  buttonColor = "#1DB4FF",
}) => (
  <div className="charity-card">
    <img src={image} alt={title} className="charity-image" />
    <div className="charity-title">{title}</div>
    <div className="charity-description">{description}</div>
    <button
      className="charity-donate-button"
      style={{ background: buttonColor }}
    >
      Donate
    </button>
  </div>
);
