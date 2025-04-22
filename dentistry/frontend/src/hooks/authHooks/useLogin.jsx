import { useState } from "react";
import authApiService from "../../services/authApiService";
import { useUser } from "../../context/UserContext";
import { useAccessToken } from "../useAccessToken";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { saveUser } = useUser();
  const { saveAccessToken } = useAccessToken();

  const login = async (dentistData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authApiService.login(dentistData);
      const { token, user } = response.data;

      saveUser(user);
      saveAccessToken(token);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};
