import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Доступ запрещён</h1>
      <p>У вас нет прав для просмотра этой страницы.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
};

export default UnauthorizedPage;
