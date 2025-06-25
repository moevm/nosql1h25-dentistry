import { useState } from "react";
import apiService from "../../services/apiService";

export const useBulkAddDentists = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const bulkAddDentists = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiService.createDentistBulk(file);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { bulkAddDentists, loading, error, success };
};
