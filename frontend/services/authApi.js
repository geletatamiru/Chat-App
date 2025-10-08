import axiosInstance from "./axiosInstance";

export const loginApi = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
} 
export const signupApi = async (data) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
}
export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const refreshApi = async () => {
  const response = await axiosInstance.get("/auth/refresh");
  return response.data; 
};

export const verifyEmail = async (email, code) => {
  const response = await axiosInstance.post("/auth/verify-email", {email, code});
  return response.data;
}

export const resendVerification = async (email) => {
  const response = await axiosInstance.post("/auth/resend-verification", {email});
  return response.data;
}

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", {email});
  return response.data;
}

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, {password});
  return response.data;
}