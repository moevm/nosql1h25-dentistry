import { createContext, useContext, useState, useEffect } from "react";
import authApiService from "../services/authApiService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      // Если есть токен, но нет пользователя или роли
      if (authToken && (!storedUser || storedUser === "undefined")) {
        try {
          const profileResponse = await authApiService.getProfile();
          const userData = profileResponse.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Ошибка при получении профиля:", error);
          // Если токен недействителен, очищаем его
          localStorage.removeItem("authToken");
        }
      } else if (storedUser && storedUser !== "undefined") {
        // Проверка на null или undefined перед парсингом
        try {
          const parsedUser = JSON.parse(storedUser);
          // Если у пользователя нет роли, получим свежий профиль
          if (authToken && !parsedUser.role) {
            try {
              const profileResponse = await authApiService.getProfile();
              const userData = profileResponse.data;
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
              console.error("Ошибка при обновлении профиля:", error);
              setUser(parsedUser); // Используем старые данные как fallback
            }
          } else {
            setUser(parsedUser); // Устанавливаем пользователя, если парсинг успешен
          }
        } catch (error) {
          console.error("Ошибка при парсинге данных пользователя:", error);
        }
      }
      setIsLoaded(true); // Устанавливаем флаг загрузки после выполнения
    };

    loadUser();
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  // Пока не загрузились данные, не рендерим приложение
  if (!isLoaded) return null;

  return (
    <UserContext.Provider value={{ user, saveUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
