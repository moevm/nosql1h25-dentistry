import { useUser } from "../context/UserContext";

const OnlyRole = ({ role, children }) => {
  const { user } = useUser();
  if (
    user?.role === role ||
    (Array.isArray(role) && role.includes(user?.role))
  ) {
    return children;
  }
  return null;
};

export default OnlyRole;
