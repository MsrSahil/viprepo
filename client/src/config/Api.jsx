import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default api;
