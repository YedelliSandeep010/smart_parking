// D:\milestone1\my-app\src\components\SlotCard.jsx
import React from "react";

const SlotCard = ({ slot, onSelect }) => {
  // Logic: Check if slot is available from MongoDB data
  const isAvailable = slot.isAvailable ?? false;
  
  // Define colors based on status
  const statusText = isAvailable ? "AVAILABLE" : "BOOKED";
  const cardColor = isAvailable ? "#d4edda" : "#f8d7da"; // Green vs Red
  const textColor = isAvailable ? "#155724" : "#721c24";
  const borderColor = isAvailable ? "#c3e6cb" : "#f5c6cb";

  return (
    <div
      onClick={() => onSelect(slot)}
      style={{
        border: `2px solid ${borderColor}`,
        padding: "20px",
        margin: "10px",
        width: "120px",
        textAlign: "center",
        borderRadius: "12px",
        cursor: isAvailable ? "pointer" : "not-allowed",
        backgroundColor: cardColor,
        color: textColor,
        transition: "transform 0.2s ease-in-out",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}
      // Hover effect logic
      onMouseOver={(e) => isAvailable && (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
        {slot.slotNumber}
      </h3>
      <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.8rem" }}>
        {statusText}
      </p>
    </div>
  );
};

export default SlotCard;