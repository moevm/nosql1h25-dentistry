import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Проверка на null или undefined перед парсингом
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Устанавливаем пользователя, если парсинг успешен
      } catch (error) {
        console.error("Ошибка при парсинге данных пользователя:", error);
      }
    }
    setIsLoaded(true); // Устанавливаем флаг загрузки после выполнения
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("user");
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
