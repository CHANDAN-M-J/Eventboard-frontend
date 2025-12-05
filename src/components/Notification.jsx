import React from "react";
import "../notification.css";

function Notification({ message, type }) {
  if (!message) return null;

  return (
    <div className={`notification ${type === "error" ? "error" : "success"}`}>
      {message}
    </div>
  );
}

export default Notification;

