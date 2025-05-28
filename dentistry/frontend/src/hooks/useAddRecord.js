import { useState } from "react";
import apiService from "../services/apiService"; // путь подкорректируй при необходимости

const useAddRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRecord = async (recordData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createRecord(recordData);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRecord, loading, error };
};

export default useAddRecord