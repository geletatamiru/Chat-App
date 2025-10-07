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