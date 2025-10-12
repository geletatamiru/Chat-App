import axiosInstance from "./axiosInstance";

// const API_URL = "https://chat-app-0l35.onrender.com/api";

export const fetchUsers = (token) => {
  const response = axiosInstance.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data;
}
export const fetchMessages = (token, id) => {
  const response = axiosInstance.get(`/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data;
}

export const fetchUnreadCounts = (token) => {
  const response = axiosInstance.get('/messages/unread/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data;
};
export const markMessageAsRead = (senderId, token) => {
  const response = axiosInstance.put(`/messages/mark-read`, { senderId }, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}