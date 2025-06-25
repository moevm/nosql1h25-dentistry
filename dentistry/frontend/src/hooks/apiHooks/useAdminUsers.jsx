import { useState, useEffect } from "react";
import apiService from "../../services/apiService";

export const useAdminUsers = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAdminUsers(filters);
      if (response.data && Array.isArray(response.data.results)) {
        setData(response.data.results);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await apiService.deleteUser(userId);
      await fetchUsers(); // Перезагружаем список
      return response;
    } catch (err) {
      throw err;
    }
  };

  const toggleUserActive = async (userId) => {
    try {
      const response = await apiService.toggleUserActive(userId);
      await fetchUsers(); // Перезагружаем список
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(filters)]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchUsers, 
    deleteUser, 
    toggleUserActive 
  };
}; 