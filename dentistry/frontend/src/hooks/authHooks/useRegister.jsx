import { useState } from "react";
import authApiService from "../../services/authApiService";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const register = async (dentistData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authApiService.register(dentistData);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};
