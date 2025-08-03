import React from "react";

const Notifications = () => {
  return (
    <div
      className="text-center rounded-sm flex items-center justify-between border-2 border-gray-200 w-full pl-2 pr-2 pt-1 pb-1"
      style={{
        backgroundColor: "#163e73",
        color: "white",
      }}
    >
      <span>Notifications</span>
      <i class="bi bi-chevron-down"></i>
    </div>
  );
};

export default Notifications;
