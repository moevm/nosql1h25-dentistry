import { useState } from "react";
import apiService from "../../services/apiService";

export const usePatchRecordById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const patchRecordById = async (id, data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiService.patchRecordById(id, data);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { patchRecordById, loading, error, success };
};
