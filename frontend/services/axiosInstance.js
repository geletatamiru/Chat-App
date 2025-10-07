import axios from "axios";
const API_URL = "http://localhost:5000/api" || "https://chat-app-0l35.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export default axiosInstance;