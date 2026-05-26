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
        >
          <Route index element={<UserManagement />} />

          <Route
            path="users"
            element={<UserManagement />}
          />

          <Route
            path="venues"
            element={<VenueManagement />}
          />

          <Route
            path="bookings"
            element={<BookingManagement />}
          />
        </Route>

        {/* staff routes */}
        <Route
          path="/staff"
          element={
            <RoleProtectedRoutes allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </RoleProtectedRoutes>
          }
        >
          <Route
            index
            element={<Home />}
          />

          <Route
            path="home"
            element={<Home />}
          />

          <Route
            path="myBookings"
            element={<MyBookings />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}