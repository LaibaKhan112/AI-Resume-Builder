import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000
});

// Automatically attach token from localStorage (or wherever you store it)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // <-- make sure this key matches your login code
  if (token) {
    config.headers.Authorization = token; // IMPORTANT: no "Bearer " here (see middleware)
  }
  return config;
});

export default api;
