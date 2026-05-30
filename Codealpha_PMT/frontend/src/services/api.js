import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "/api",
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem("taskflow_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ─── Tasks ─────────────────────────────────────────────
export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ─── Profile ───────────────────────────────────────────
export const getProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);

export default api;
