import { Outlet } from "react-router-dom";
import AuthNavLinks from "../AuthNavLinks";
import BaseShell from "../BaseShell";

const AuthShell = () => (
  <BaseShell>
    <AuthNavLinks />
    <Outlet />
  </BaseShell>
);

export default AuthShell;
