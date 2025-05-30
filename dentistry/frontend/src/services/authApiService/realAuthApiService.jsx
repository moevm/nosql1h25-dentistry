import axios from "axios";
import { API_URL } from "../../config.js";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

const authApiService = {
  login: (data) => {
    return api
      .post("/api/auth/token/login/", data)
      .then((response) => {
        if (response.data && response.data.auth_token) {
          localStorage.setItem("authToken", response.data.auth_token);
        }
        return response;
      })
      .catch((error) => {
        console.error("Ошибка при авторизации:", error);
        throw error;
      });
  },

  register: (data) => {
    return api
      .post("/api/auth/users/", data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Ошибка при регистрации:", error);
        throw error;
      });
  },

  getProfile: () => {
    return api
      .get("/api/auth/users/me/")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Ошибка при получении профиля:", error);
        throw error;
      });
  },
};

export default authApiService;
