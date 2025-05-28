import { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const getByRole = {
  patient: apiService.getClientById,
  specialist: apiService.getDentistById,
};

export const useUserById = ({ id, role }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetch = getByRole[role];

    fetch(id)
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.message);

        console.error("Error fetching current user:", err);
      })
      .finally(() => setLoading(false));
  }, [id, role]);

  return { data, loading, error };
};
