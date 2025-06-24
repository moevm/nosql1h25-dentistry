import { useEffect, useState } from "react";
import apiService from "../../services/apiService";

export const useRecords = (filters = {}, page = 1, limit = 10) => {
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiService
      .getRecords({ ...filters, page, limit })
      .then((res) => setData({
        results: res.data.results || [],
        count: res.data.count || 0,
        next: res.data.next || null,
        previous: res.data.previous || null,
      }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters), page, limit]);

  return { ...data, loading, error };
};

export const useRecordById = (id) => {
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