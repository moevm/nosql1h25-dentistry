import { createBrowserRouter } from "react-router-dom";

// Import the pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

// Import the outlet component
import AuthShell from "./components/AuthShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    element: <AuthShell />,
    children: [
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <ChangePasswordPage />,
  },
]);
