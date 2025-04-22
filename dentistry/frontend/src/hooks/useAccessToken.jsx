import { useEffect, useState } from "react";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const saveAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return { accessToken, saveAccessToken, removeAccessToken };
};
