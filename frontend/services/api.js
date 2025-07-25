import axios from "axios";

const API_URL = "https://chat-app-0l35.onrender.com/api";

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
export const fetchUnreadCounts = (token) => {
  return axios.get(`${API_URL}/messages/unread/count`, {
    headers: { 
      'x-auth-token': token 
    }
})};
export const markMessageAsRead = (senderId, token) => {
  return axios.put(`${API_URL}/messages/mark-read`, { senderId }, {
    headers: {
      'x-auth-token': token
    }
});
}