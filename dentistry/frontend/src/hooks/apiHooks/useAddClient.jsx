import { useState } from "react";
import apiService from "../../services/apiService";

export const useAddClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addClient = async (dentistData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.createDentist(dentistData);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { addClient, loading, error, success };
};
