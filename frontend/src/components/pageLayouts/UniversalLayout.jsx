import { useUser } from "../../context/UserContext";

const UniversalLayout = ({ layouts }) => {
  const { user } = useUser();

  if (!user) return null;

  const Layout = layouts[user.role];
  if (Layout) {
    return <Layout />;
  }

  console.error("No layout found for role:", user.role);
  return null;
};

export default UniversalLayout;
