import PageHeader from "./PageHeader";

const SpecialistHeader = () => (
  <PageHeader
    links={[
      { to: "/specialist/records", label: "Записи" },
      { to: "/patients", label: "Пациенты" },
      { to: "/specialists", label: "Специалисты" },
      { to: "/profile", label: "Мой профиль" },
      { to: "/", label: "Главная" },
    ]}
  />
);

export default SpecialistHeader;
