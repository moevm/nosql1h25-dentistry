import { useState } from "react";
import apiService from "../../services/apiService";

export const useDeleteRecordById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteRecordById = async (id, data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiService.deleteRecordById(id, data);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecordById, loading, error, success };
};
