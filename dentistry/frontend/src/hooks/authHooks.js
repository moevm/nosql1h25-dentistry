import { useState } from 'react';
import { useUser } from '../context/UserContext';
import authApiService from '../services/authApiService';
import { useAccessToken } from './useAccessToken';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const { saveUser } = useUser();
  const { saveAccessToken } = useAccessToken();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApiService.login(credentials);
      const { auth_token } = response.data;
      
      if (auth_token) {
        setAuthToken(auth_token);
        saveAccessToken(auth_token);
        
        // Получаем профиль пользователя после успешного логина
        try {
          const profileResponse = await authApiService.getProfile();
          const userData = profileResponse.data;
          setUser(userData);
          saveUser(userData);
          setSuccess(true);
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
          setError('Ошибка при получении данных пользователя');
          setSuccess(false);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data?.detail || 'Произошла ошибка при входе');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success, authToken, user };
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
      console.error('Registration error:', err);
      let errorMessage = 'Произошла ошибка при регистрации';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
          // Обработка ошибок валидации полей
          const errors = [];
          Object.keys(err.response.data).forEach(field => {
            if (Array.isArray(err.response.data[field])) {
              errors.push(`${field}: ${err.response.data[field].join(', ')}`);
            } else {
              errors.push(`${field}: ${err.response.data[field]}`);
            }
          });
          errorMessage = errors.join('; ');
        }
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};