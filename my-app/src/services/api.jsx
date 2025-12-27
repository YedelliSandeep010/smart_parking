// D:\milestone1\my-app\src\services\api.js
import axios from "axios";

const api = axios.create({
  // Pointing to your Node.js backend port
  baseURL: "http://localhost:5000/api", 
});

// This interceptor automatically attaches your JWT token 
// to requests after a user logs in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;