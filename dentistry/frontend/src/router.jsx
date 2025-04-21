import { createBrowserRouter } from "react-router-dom";

// Import the pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import RecordsPage from "./pages/user/RecordsPage";
import SpecialistRecordsPage from "./pages/specialist/SpecialistRecordsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Import the layout components
import PatientPageWrapper from "./components/pageLayouts/PatientPageLayout";
import SpecialistPageWrapper from "./components/pageLayouts/SpecialistPageLayout";

// Import the outlet component
import AuthShell from "./components/AuthShell";
import ProtectedRoute from "./components/ProtectedRoute";

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
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    element: <ProtectedRoute allowedRoles={["patient"]} />,
    children: [
      {
        element: <PatientPageWrapper />,
        children: [
          {
            path: "/records",
            element: <RecordsPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["specialist", "admin"]} />,
    children: [
      {
        element: <SpecialistPageWrapper />,
        children: [
          {
            path: "/specialist/records",
            element: <SpecialistRecordsPage />,
          },
        ],
      },
    ],
  },
]);
