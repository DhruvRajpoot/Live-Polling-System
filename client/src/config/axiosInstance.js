import axios from "axios";

export const API_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
