import { createBrowserRouter } from "react-router-dom";

// Import the pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import RecordsPage from "./pages/RecordsPage";
import RecordPage from "./pages/RecordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AddRecordPage from "./pages/AddRecordPage";
import ProfilePage from "./pages/ProfilePage";
import MainPage from "./pages/MainPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import PatientsPage from "./pages/PatientsPage";
import AddPatientPage from "./pages/admin/AddPatientPage";
import AddSpecialistPage from "./pages/admin/AddSpecialistPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

// Import the layout components
import PatientLayout from "./components/pageLayouts/PatientLayout";
import SpecialistLayout from "./components/pageLayouts/SpecialistLayout";
import AdminLayout from "./components/pageLayouts/AdminLayout";

// Import the outlet component
import AuthShell from "./components/AuthShell";
import ProtectedRoute from "./components/ProtectedRoute";
import UniversalLayout from "./components/pageLayouts/UniversalLayout";

export const router = createBrowserRouter([
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
        element: <PatientLayout />,
        children: [],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboardPage />,
          },
          {
            path: "/add-patient",
            element: <AddPatientPage />,
          },
          {
            path: "/add-specialist",
            element: <AddSpecialistPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["specialist", "admin"]} />,
    children: [
      {
        element: <SpecialistLayout />,
        children: [
          {
            path: "patients",
            element: <PatientsPage />,
          },
          {
            path: "patients/:id",
            element: <ProfilePage userRole={"patient"} />,
          },
        ],
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["patient", "specialist", "admin"]} />
    ),
    children: [
      {
        element: <MainPage></MainPage>,
        path: "/",
      },
      {
        element: (
          <UniversalLayout
            layouts={{
              patient: PatientLayout,
              specialist: SpecialistLayout,
              admin: AdminLayout,
            }}
          />
        ),
        children: [
          { path: "records", element: <RecordsPage /> },
          {
            path: "records/:id",
            element: <RecordPage />,
          },

          {
            path: "add_record",
            element: <AddRecordPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "specialists",
            element: <SpecialistsPage />,
          },
          {
            path: "specialists/:id",
            element: <ProfilePage userRole={"specialist"} />,
          },
        ],
      },
    ],
  },
]);
