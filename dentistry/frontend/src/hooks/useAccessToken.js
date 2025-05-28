export const useAccessToken = () => {
  const saveAccessToken = (token) => {
    localStorage.setItem('token', token);
  };

  const removeAccessToken = () => {
    localStorage.removeItem('token');
  };

  const getAccessToken = () => {
    return localStorage.getItem('token');
  };

  return { saveAccessToken, removeAccessToken, getAccessToken };
};