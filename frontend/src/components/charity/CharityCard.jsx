export const statusMap = {
  Active:            { text: "Active",            color: "#41b9e4",   textColor: "#fff" },
  Cancelled:         { text: "Cancelled",         color: "#ff3737",   textColor: "#fff" },
  Completed:         { text: "Completed",         color: "#00e164",   textColor: "#fff" },
  Finished:          { text: "Finished",          color: "#00e164",   textColor: "#fff" },
  Expired:           { text: "Expired",           color: "#999",      textColor: "#fff" },
  FinalizedEarly:    { text: "Finalized Early",   color: "#FFC107",   textColor: "#222" },
  AwaitingDecision:  { text: "Waiting for your decision", color: "#ffe600",   textColor: "#222" },
  AwaitingApproval:  { text: "Waiting for approvment", color: "#ffe600",   textColor: "#222" },
  Confirmed:         { text: "Confirmed",         color: "#90eaaa",   textColor: "#222" },
  Rejected:          { text: "Rejected",          color: "#ff3737",   textColor: "#fff" },
  FundsTransferred:  { text: "Funds Transferred", color: "#1db4ff",   textColor: "#fff" },
  ReportSubmitted:   { text: "Report Submitted",  color: "#bdbdbd",   textColor: "#222" },
  Verified:          { text: "Verified",          color: "#4CAF50",   textColor: "#fff" },
  VoteExpired:       { text: "Vote Expired",      color: "#FFA500",   textColor: "#222" },
  waiting:           { text: "Waiting...",        color: "#ffe600",   textColor: "#222" },
  waiting_approval:  { text: "Waiting for approvment", color: "#ffe600", textColor: "#222" },
  canceled:          { text: "Cancelled",         color: "#ff3737",   textColor: "#fff" },
};


export const CharityCard = ({
  image,
  title,
  description,
  status,
  onDonate,
  buttonColor = "#1DB4FF"
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
