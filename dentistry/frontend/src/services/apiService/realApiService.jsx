import axios from "axios";
import { API_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  // Dentists
  getDentists: (params) => api.get("/dentists/", { params }),

  createDentist: (data) => api.post("/dentists", data),

  getDentistById: (id) => api.get(`/dentists/${id}`),

  updateDentistById: (id, data) => api.patch(`/dentists/${id}`, data),

  deleteDentistById: (id) => api.delete(`/dentists/${id}`),

  getCurrentDentist: () => api.get("/dentists/me"),

  updateCurrentDentist: (data) => api.put("/dentists/me", data),

  patchCurrentDentist: (data) => api.patch("/dentists/me", data),

  updateDentistAvatar: (data) => api.put("/dentists/me/avatar", data),

  patchDentistAvatar: (data) => api.patch("/dentists/me/avatar", data),

  deleteDentistAvatar: () => api.delete("/dentists/me/avatar"),

  // Clients
  getClients: (params) => api.get("/clients/", { params }),

  createClient: (data) => api.post("/clients", data),

  getClientById: (id) => api.get(`/clients/${id}`),

  updateClientById: (id, data) => api.patch(`/clients/${id}`, data),

  deleteClientById: (id) => api.delete(`/clients/${id}`),

  getCurrentClient: () => api.get("/clients/me"),

  updateCurrentClient: (data) => api.put("/clients/me", data),

  patchCurrentClient: (data) => api.patch("/clients/me", data),

  updateClientAvatar: (data) => api.put("/clients/me/avatar", data),

  patchClientAvatar: (data) => api.patch("/clients/me/avatar", data),

  deleteClientAvatar: () => api.delete("/clients/me/avatar"),

  // Records
  getRecords: (params) => api.get("/records/", { params }),

  createRecord: (data) => api.post("/records/", data),

  getRecordById: (id) => api.get(`/records/${id}/`),

  updateRecordById: (id, data) => api.put(`/records/${id}/`, data),

  patchRecordById: (id, data) => api.patch(`/records/${id}/`, data),

  deleteRecordById: (id) => api.delete(`/records/${id}/`),

  // Admin API
  getAdminDashboard: () => api.get("/admin/dashboard/"),

  getAdminUsers: (params) => api.get("/admin/users/", { params }),

  deleteUser: (userId) => api.delete(`/admin/users/${userId}/`),

  toggleUserActive: (userId) => api.patch(`/admin/users/${userId}/toggle/`),

  exportUsers: () => api.get("/admin/export/users/", { responseType: 'blob' }),

  exportRecords: () => api.get("/admin/export/records/", { responseType: 'blob' }),

  // Bulk operations (updated to use admin endpoints if needed)
  createDentistBulk: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post("/dentists/bulk-create/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  createClientBulk: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post("/clients/bulk-create/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default apiService;
