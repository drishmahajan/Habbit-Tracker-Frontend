import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const sendPasswordResetEmail = (email) =>
  API.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  API.post(`/auth/reset-password/${token}`, { password });

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
