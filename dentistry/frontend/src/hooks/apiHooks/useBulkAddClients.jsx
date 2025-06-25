import { useState } from "react";
import apiService from "../../services/apiService";

export const useBulkAddClients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const bulkAddClients = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiService.createClientBulk(file);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { bulkAddClients, loading, error, success };
};
