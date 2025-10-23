import axios from "axios";
const API_URL = `${import.meta.env.VITE_BASE_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export default axiosInstance;