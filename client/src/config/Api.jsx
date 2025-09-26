import axios from "axios";

// Jab code Netlify par chalega, to VITE_API_URL use hoga.
// Jab local computer par chalega, to localhost wala URL use hoga.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4500";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

export default api;