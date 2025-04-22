import { useState } from "react";
import apiService from "../../services/apiService";

export const useBulkAddClients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addBulkAddClients = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiService.createDentistBulk(formData);
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { addBulkAddClients, loading, error, success };
};
