import { useUser } from "../../context/UserContext";
import MainPage from "./MainPage";

const ClientMainPage = () => (
  <MainPage
    title={"ГЛАВНАЯ СТРАНИЦА ПАЦИЕНТА"}
    first_link_list={[
      { name: "Посмотреть мои записи", to: "/records" },
      { name: "Посмотреть врачей", to: "/specialists" },
      { name: "Записаться на прием", to: "/add_record" },
    ]}
    second_list_link={[
      { name: "Открыть медицинскую карту", to: "/medical_card" },
      { name: "Перейти в мой профиль", to: "/profile" },
    ]}
  ></MainPage>
);

const SpecialistMainPage = () => (
  <MainPage
    title={"ГЛАВНАЯ СТРАНИЦА ВРАЧА"}
    first_link_list={[
      { name: "Посмотреть ближайшие приемы", to: "/records" },
      { name: "Информация о пациентах", to: "/patients" },
    ]}
    second_list_link={[
      { name: "Создать запись", to: "/add_record" },
      { name: "Перейти в мой профиль", to: "/profile" },
    ]}
  ></MainPage>
);

const AdminMainPage = () => (
  <MainPage
    title={"ГЛАВНАЯ СТРАНИЦА АДМИНА"}
    first_link_list={[
      { name: "Посмотреть записи", to: "/records" },
      { name: "Управлять врачами", to: "/specialists" },
      { name: "Управлять пациентами", to: "/patients" },
    ]}
    second_list_link={[
      { name: "Создать запись", to: "/add_record" },
      { name: "Перейти в мой профиль", to: "/profile" },
    ]}
  ></MainPage>
);

const layouts = {
  patient: ClientMainPage,
  specialist: SpecialistMainPage,
  admin: AdminMainPage,
};

const UniversalMainPage = () => {
  const { user } = useUser();

  if (!user) return null;

  const Layout = layouts[user.role];
  if (Layout) {
    return <Layout />;
  }

  console.error("No page found for role:", user.role);
  return null;
};

export default UniversalMainPage;
