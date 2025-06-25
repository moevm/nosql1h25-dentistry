import PageHeader from "./PageHeader";

const AdminHeader = () => (
  <PageHeader
    links={[
      { to: "/admin", label: "Админ панель" },
      { to: "/records", label: "Записи" },
      { to: "/patients", label: "Пациенты" },
      { to: "/specialists", label: "Специалисты" },
      { to: "/profile", label: "Мой профиль" },
      { to: "/", label: "Главная" },
    ]}
  />
);

export default AdminHeader; 