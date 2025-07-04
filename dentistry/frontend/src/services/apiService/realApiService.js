/// <reference path="./apiTypes.js" />

/// <reference path="./apiTypes.js" />

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

const apiService = {
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser[]>>} */
  getDentists: (params) => api.get("/dentists/", { params }),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  createDentist: (data) => api.post("/dentists/", data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  getDentistById: (id) => api.get(`/dentists/${id}/`),

  /** @param {number} id */
  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  updateDentistById: (id, data) => api.patch(`/dentists/${id}/`, data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  deleteDentistById: (id) => api.delete(`/dentists/${id}/`),

  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  getCurrentDentist: () => api.get("/dentists/me/"),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  updateCurrentDentist: (data) => api.put("/dentists/me/", data),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  patchCurrentDentist: (data) => api.patch("/dentists/me/", data),

  /** @param {{ avatar: string }} data */
  /** @returns {Promise<import("axios").AxiosResponse<Avatar>>} */
  updateDentistAvatar: (data) => api.put("/dentists/me/avatar/", data),

  /** @param {{ avatar: string }} data */
  /** @returns {Promise<import("axios").AxiosResponse<Avatar>>} */
  patchDentistAvatar: (data) => api.patch("/dentists/me/avatar/", data),

  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  deleteDentistAvatar: () => api.delete("/dentists/me/avatar/"),

  /** @returns {Promise<import("axios").AxiosResponse<CustomUser[]>>} */
  getClients: (params) => api.get("/clients/", { params }),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  createClient: (data) => api.post("/clients/", data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  getClientById: (id) => api.get(`/clients/${id}/`),

  /** @param {number} id */
  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  updateClientById: (id, data) => api.patch(`/clients/${id}/`, data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  deleteClientById: (id) => api.delete(`/clients/${id}/`),

  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  getCurrentClient: () => api.get("/clients/me/"),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  updateCurrentClient: (data) => api.put("/clients/me/", data),

  /** @param {CustomUser} data */
  /** @returns {Promise<import("axios").AxiosResponse<CustomUser>>} */
  patchCurrentClient: (data) => api.patch("/clients/me/", data),

  /** @param {{ avatar: string }} data */
  /** @returns {Promise<import("axios").AxiosResponse<Avatar>>} */
  updateClientAvatar: (data) => api.put("/clients/me/avatar/", data),

  /** @param {{ avatar: string }} data */
  /** @returns {Promise<import("axios").AxiosResponse<Avatar>>} */
  patchClientAvatar: (data) => api.patch("/clients/me/avatar/", data),

  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  deleteClientAvatar: () => api.delete("/clients/me/avatar/"),

  /** @param {Object} params */
  /** @returns {Promise<import("axios").AxiosResponse<Record[]>>} */
  getRecords: (params) => api.get("/records/", { params }),

  /** @param {RecordInput} data */
  /** @returns {Promise<import("axios").AxiosResponse<Record>>} */
  createRecord: (data) => api.post("/records/", data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<Record>>} */
  getRecordById: (id) => api.get(`/records/${id}/`),

  /** @param {number} id */
  /** @param {RecordInput} data */
  /** @returns {Promise<import("axios").AxiosResponse<Record>>} */
  updateRecordById: (id, data) => api.put(`/records/${id}/`, data),

  /** @param {number} id */
  /** @param {RecordInput} data */
  /** @returns {Promise<import("axios").AxiosResponse<Record>>} */
  patchRecordById: (id, data) => api.patch(`/records/${id}/`, data),

  /** @param {number} id */
  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  deleteRecordById: (id) => api.delete(`/records/${id}/`),

  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  getAdminDashboard: () => api.get("/admin/dashboard/"),

  getAdminUsers: (params) => api.get("/admin/users/", { params }),

  deleteUser: (userId) => api.delete(`/admin/users/${userId}/`),

  toggleUserActive: (userId) => api.patch(`/admin/users/${userId}/toggle/`),

  exportUsers: () => api.get("/admin/export/users/", { responseType: 'blob' }),

  exportRecords: () => api.get("/admin/export/records/", { responseType: 'blob' }),

  /** @param {File} file */
  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  createDentistBulk: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post("/dentists/bulk/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /** @param {File} file */
  /** @returns {Promise<import("axios").AxiosResponse<void>>} */
  createClientBulk: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post("/clients/bulk/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default apiService;
