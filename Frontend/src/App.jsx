import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login/Login.jsx";

import RoleProtectedRoutes from "./routes/RoleProtectedRoutes.jsx";

//Admin
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import VenueManagement from "./pages/admin/VenueManagement.jsx";
import BookingManagement from "./pages/admin/BookingManagement.jsx";

//staff 
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import MyBookings from "./pages/staff/MyBookings.jsx";
import Home from "./pages/staff/Home.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoutes allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleProtectedRoutes>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoutes allowedRoles={["admin"]}>
              <UserManagement />
            </RoleProtectedRoutes>
          }
        />

        <Route
          path="/admin/venues"
          element={
            <RoleProtectedRoutes allowedRoles={["admin"]}>
              <VenueManagement />
            </RoleProtectedRoutes>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <RoleProtectedRoutes allowedRoles={["admin"]}>
              <BookingManagement />
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
          <Route
          path="/staff/home"
          element={
            <RoleProtectedRoutes allowedRoles={["staff", "admin"]}>
              <Home></Home>
            </RoleProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}