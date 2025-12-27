// D:\Smart_parking\server\frontend\src\components\Booking.jsx
import React, { useState } from "react";
import api from "../services/api";

const Booking = ({ slots }) => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [message, setMessage] = useState("");

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!vehicleNo || !selectedSlotId) {
      setMessage("Please enter vehicle number and select a slot.");
      return;
    }

    try {
      // Calls app.patch("/api/slots/book/:id") in your index.js
      const response = await api.patch(`/slots/book/${selectedSlotId}`);
      
      setMessage(`Success: ${response.data.message}`);
      setVehicleNo("");
      setSelectedSlotId("");

      // Refresh to update colors (Green -> Red)
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage("Booking failed. Check backend console.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", background: "white", borderRadius: "15px", margin: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#007cc3" }}>Reserve a Space</h2>
      
      <form onSubmit={handleConfirmBooking}>
        <input
          type="text"
          placeholder="Enter Vehicle Number (e.g. TS-09-1234)"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
        />

        <select
          value={selectedSlotId}
          onChange={(e) => setSelectedSlotId(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <option value="">-- Choose Available Slot --</option>
          {slots.filter(s => s.isAvailable).map((slot) => (
            <option key={slot._id} value={slot._id}>
              Slot {slot.slotNumber}
            </option>
          ))}
        </select>

        <button type="submit" className="submit-btn" style={{ background: "#28a745" }}>
          Confirm Booking
        </button>
      </form>

      {message && <p style={{ color: message.includes("Success") ? "green" : "red", marginTop: "15px" }}>{message}</p>}
    </div>
  );
};

export default Booking;