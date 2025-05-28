import axios from "axios";
import { VITE_API_URL } from "../../config.js";

const api = axios.create({
  baseURL: VITE_API_URL,
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
    // Выполняем запрос на сервер
    return api
      .post("/auth/token/login/", data)
      .then((response) => {
        // Проверяем, есть ли токен в ответе и сохраняем его в localStorage
        if (response.data && response.data.auth_token) {
          // Сохраняем токен
          localStorage.setItem("authToken", response.data.auth_token);
        }
        return response;
      })
      .catch((error) => {
        // Обрабатываем ошибку, если запрос не удался
        console.error("Ошибка при авторизации:", error);
        throw error;
      });
  },

  register: (data) => {
    return api
      .post("/auth/users/", data)
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
      .get("/auth/users/me/")
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
