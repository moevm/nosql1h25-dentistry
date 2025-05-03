import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
  getDentists: () => api.get("/dentists/"),

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
  getClients: () => api.get("/clients"),

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
};

export default apiService;
