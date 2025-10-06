import axios from "axios";
import { cookieStore } from "cookie-store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
   headers: {
    Authorization: `Bearer ${cookieStore.get("token")?.value || ""}`,
  },
});

export default api;