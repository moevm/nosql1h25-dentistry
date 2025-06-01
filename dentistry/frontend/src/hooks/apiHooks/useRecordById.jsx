import { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // путь поправь, если структура иная

const useRecordById = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    apiService
      .getRecordById(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
};

export default useRecordById;