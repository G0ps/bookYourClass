import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login/Login.jsx";

import RoleProtectedRoutes from "./routes/RoleProtectedRoutes.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoutes allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleProtectedRoutes>
          }
        />

        <Route
          path="/staff"
          element={
            <RoleProtectedRoutes allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </RoleProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}