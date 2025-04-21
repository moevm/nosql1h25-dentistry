import PageHeader from "./PageHeader";

const PatientHeader = () => (
  <PageHeader
    links={[
      { to: "/records", label: "Записи" },
      { to: "/specialists", label: "Специалисты" },
      { to: "/medical-card", label: "Медицинская карта" },
      { to: "/profile", label: "Мой профиль" },
      { to: "/", label: "Главная" },
    ]}
  />
);

export default PatientHeader;
