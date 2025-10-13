import axiosInstance from "./axiosInstance";

// const API_URL = "https://chat-app-0l35.onrender.com/api";

export const fetchUsers = async (token) => {
  const res = await axiosInstance.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
}
export const fetchMessages = async (token, id) => {
  const res = await axiosInstance.get(`/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
}

export const fetchUnreadCounts = async (token) => {
  const res = await axiosInstance.get('/messages/unread/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
};
export const markMessageAsRead = async (senderId, token) => {
  const res = await axiosInstance.put(`/messages/mark-read`, { senderId }, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}