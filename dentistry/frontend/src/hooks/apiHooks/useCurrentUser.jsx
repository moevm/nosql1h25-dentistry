import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import apiService from "../../services/apiService";

/**
 * @returns {{ data: CustomUser | null, loading: boolean, error: string | null }}
 */
export const useCurrentUser = () => {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetch =
      user.role === "patient"
        ? apiService.getCurrentClient
        : apiService.getCurrentDentist;

    fetch()
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.message);

        console.error("Error fetching current user:", err);
      })
      .finally(() => setLoading(false));
  }, [user?.role]);

  return { data, loading, error };
};
