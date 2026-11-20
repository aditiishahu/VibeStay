import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vibestay_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
  return "Something went wrong. Please try again.";
};

export default api;
