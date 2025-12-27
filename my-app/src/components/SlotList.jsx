
import React, { useEffect, useState, useCallback } from "react";
import SlotCard from "./SlotCard"; 
import api from "../services/api";

const SlotList = ({ onSlotsFetched }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch slots from MongoDB via Node.js backend
  
  const fetchSlots = useCallback(async () => {
  try {
    const res = await api.get("/slots"); 
    const data = Array.isArray(res.data) ? res.data : [];
    setSlots(data);
    if (onSlotsFetched) onSlotsFetched(data); 
  } catch (err) {
    console.error("Error fetching slots:", err);
  }
}, [onSlotsFetched]); // Memoize the function

useEffect(() => {
  fetchSlots();
  const interval = setInterval(fetchSlots, 30000);
  return () => clearInterval(interval);
}, [fetchSlots]); // fetchSlots is now a stable dependency

  useEffect(() => {
    fetchSlots();
    // Optional: Refresh data every 30 seconds to update colors automatically
    const interval = setInterval(fetchSlots, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (slot) => {
    // Only allow selecting slots that are Green (isAvailable: true)
    if (!slot.isAvailable) return; 
    setSelectedSlot(slot);
  };

  if (loading) {
    return <div className="loader">Loading Parking Map...</div>;
  }

  return (
    <div className="slot-list-section">
      <h2 className="section-title">Live Parking Map</h2>
      
      {selectedSlot && (
        <div className="selection-announcement" style={{ color: "#28a745", marginBottom: "15px", fontWeight: "bold" }}>
          📍 Selected Slot: {selectedSlot.slotNumber}
        </div>
      )}

      {/* This grid layout is styled by Dashboard.css */}
      <div className="slots-grid" style={{ 
        display: "flex", 
        gap: "15px", 
        flexWrap: "wrap", 
        justifyContent: "flex-start" 
      }}>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <div className="no-data-msg">
            <p>No slots found in database.</p>
            <small>Please check your MongoDB connection or add slots via Thunder Client.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotList;