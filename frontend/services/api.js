import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchUsers = (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: {
      "x-auth-token": token
    }
  })
}
export const fetchMessages = (token, id) => {
  return axios.get(`${API_URL}/messages/${id}`, {
    headers: {
      "x-auth-token": token
    }
  })
}

export const loginUser = (formData) => {
   return axios.post(`${API_URL}/auth`, formData);
}

export const registerUser = (formData) => {
   return axios.post(`${API_URL}/register`, formData);
}
