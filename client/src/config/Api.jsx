import axios from "axios";
import { cookieStore } from "cookie-store";
// Jab code Netlify par chalega, to VITE_API_URL use hoga.
// Jab local computer par chalega, to localhost wala URL use hoga.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4500";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  
  //To use this please install cookie-store quickly using npm i cookie-store
  headers: {
    Authorization: `Bearer ${cookieStore.get("token")?.value || ""}`,
  },
});

export default api;