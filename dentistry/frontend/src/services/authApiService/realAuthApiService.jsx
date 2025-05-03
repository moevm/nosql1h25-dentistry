import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
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
};

export default authApiService;
