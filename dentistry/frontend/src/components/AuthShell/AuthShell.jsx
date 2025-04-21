import AuthNavLinks from "../AuthNavLinks";
import BaseShell from "../BaseShell";

const AuthShell = ({ children }) => (
  <BaseShell>
    <AuthNavLinks />
    {children}
  </BaseShell>
);

export default AuthShell;
