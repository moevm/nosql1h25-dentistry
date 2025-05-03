import { useState } from "react";
import authApiService from "../../services/authApiService";
import { useUser } from "../../context/UserContext";
import { useAccessToken } from "../useAccessToken";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Инициализация success как false
  const { saveUser } = useUser();
  const { saveAccessToken } = useAccessToken();

  const login = async (dentistData) => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Обновляем success при каждом новом запросе

    try {
      const response = await authApiService.login(dentistData);
      const { token, user } = response.data;

      // Проверяем, что мы получили токен и пользователя
      if (token && user) {
        saveUser(user);
        saveAccessToken(token);
        setSuccess(true); // Устанавливаем успех после логина
      } else {
        throw new Error("Invalid response data");
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};
