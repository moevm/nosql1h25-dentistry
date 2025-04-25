import { useState } from 'react';
import { useUser } from '../context/UserContext';
import authApiService from '../services/authApiService/realAuthApiService';
import { useAccessToken } from './useAccessToken';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { saveUser } = useUser();
  const { saveAccessToken } = useAccessToken();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApiService.login(credentials);
      const { access_token, user } = response.data;
      saveAccessToken(access_token);
      saveUser(user);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при входе');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authApiService.register(data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при регистрации');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};