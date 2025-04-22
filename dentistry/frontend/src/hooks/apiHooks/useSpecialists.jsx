import { useEffect, useState } from "react";
import apiService from "../../services/apiService";

export const useSpecialists = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiService
      .getDentists(filters)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};
