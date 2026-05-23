import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login/Login.jsx";

import RoleProtectedRoutes from "./routes/RoleProtectedRoutes.jsx";

//Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

//staff 
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import MyBookings from "./pages/staff/MyBookings.jsx";

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

        {/*staff routes*/}
        <Route
          path="/staff"
          element={
            <RoleProtectedRoutes allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </RoleProtectedRoutes>
          }
        />
        <Route
            path="/staff/myBookings"
            element={<MyBookings />}
          />

      </Routes>
    </BrowserRouter>
  );
}