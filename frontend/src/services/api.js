import axios from "axios";

// Use production URL if available, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🌐 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }
    return Promise.reject(error);
  },
);

// Projects API
export const getProjects = () => api.get("/projects");
export const createProject = (formData) =>
  api.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const updateProject = (id, formData) =>
  api.put(`/projects/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Clients API
export const getClients = () => api.get("/clients");
export const createClient = (formData) =>
  api.post("/clients", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const updateClient = (id, formData) =>
  api.put(`/clients/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Contacts API
export const getContacts = () => api.get("/contacts");
export const submitContact = (data) => api.post("/contacts", data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// Newsletter API
export const getSubscribers = () => api.get("/newsletter");
export const subscribeNewsletter = (data) => api.post("/newsletter", data);
export const deleteSubscriber = (id) => api.delete(`/newsletter/${id}`);

export default api;
