import React, { useState } from 'react';
import './App.css';
import './Dashboard.css'; 
import SlotList from './components/SlotList';
import Booking from './components/Booking';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [slots, setSlots] = useState([]); 
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'user', 
    phone: '', 
    vehicleType: '', 
    vehicleNumber: ''
  });

  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true); 
        } else {
          alert("Registration Successful! Please login.");
          setIsLogin(true);
        }
      } else {
        alert("Error: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Backend not running? Make sure 'node index.js' is active.");
    }
  };

  // --- SHOW DASHBOARD IF LOGGED IN ---
  if (isLoggedIn) {
    return (
      <div className="page-wrapper" style={{ alignItems: 'flex-start' }}>
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 style={{color: 'white'}}>Park Ease Dashboard</h1>
            <button onClick={() => setIsLoggedIn(false)} className="logout-btn">Logout</button>
          </header>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <SlotList onSlotsFetched={setSlots} />
            <Booking slots={slots} />
          </div>
        </div>
      </div>
    );
  }

  // --- SHOW LOGIN FORM IF NOT LOGGED IN ---
  return (
    <div className="page-wrapper">
      <div className="glass-container">
        <div className="brand-section">
          <div className="logo-circle">P</div>
          <h1>Park Ease</h1>
          <p>Smart Parking Spot Finder</p>
        </div>

        <div className="auth-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="styled-form">
          <div className="scroll-area">
            {!isLogin && (
              <div className="input-box">
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
              </div>
            )}
            
            <div className="input-box">
              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            </div>
            
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>

            {!isLogin && (
              <>
                <div className="input-box">
                  <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
                </div>
                
                {/* FIX: Added vehicleType dropdown required by your backend */}
                <div className="input-box">
                  <select name="vehicleType" onChange={handleChange} required>
                    <option value="">Select Vehicle Type</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>

                <div className="input-box">
                  <input type="text" name="vehicleNumber" placeholder="Vehicle Number" onChange={handleChange} required />
                </div>

                <div className="input-box">
                  <select name="role" onChange={handleChange}>
                    <option value="user">Driver (User)</option>
                    <option value="admin">Parking Admin</option>
                  </select>
                </div>
              </>
            )}
          </div>
          
          <button type="submit" className="submit-btn">
            {isLogin ? "Sign In" : "Join Park Ease"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already registered?"}
          <span onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', color: '#007cc3'}}>
            {isLogin ? " Create one" : " Login now"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;