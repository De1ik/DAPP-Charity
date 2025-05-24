import React from "react";

const statusMap = {
  waiting_approval: { text: "Waiting for approvment", color: "#ffe600", textColor: "#222" },
  waiting: { text: "Waiting...", color: "#ffe600", textColor: "#222" },
  canceled: { text: "Canceled", color: "#ff3737", textColor: "#fff" },
  finished: { text: "Finished", color: "#00e164", textColor: "#fff" },
};

export const CharityCard = ({
  image,
  title,
  description,
  buttonColor = "#1DB4FF",
  status,
                                onDonate,
}) => {
  const badge = statusMap[status];
  return (
    <div className="charity-card">
      {badge && (
        <div
          className="charity-status-badge"
          style={{ background: badge.color, color: badge.textColor }}
        >
          {badge.text}
        </div>
      )}
      <img src={image} alt={title} className="charity-image" />
      <div className="charity-title">{title}</div>
      <div className="charity-description">{description}</div>
      <button
        className="charity-donate-button"
        style={{ background: buttonColor }}
        onClick={onDonate}
      >
        Donate
      </button>
    </div>
  );
};
