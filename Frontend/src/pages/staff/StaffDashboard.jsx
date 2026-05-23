// src/pages/staff/StaffDashboard.jsx

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./StaffDashboard.module.css";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();

      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    localStorage.clear();
    sessionStorage.clear();

    window.history.replaceState(null, "", "/");

    navigate("/", { replace: true });
  };

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.closed
        }`}
      >
        <button
          className={styles.toggleBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        {sidebarOpen && (
          <>
            <h2 className={styles.heading}>
              Staff Panel
            </h2>

            <nav className={styles.navLinks}>
              <NavLink
                to="/staff"
                end
                className={({ isActive }) =>
                  isActive
                    ? styles.activeLink
                    : styles.link
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/staff/myBookings"
                className={({ isActive }) =>
                  isActive
                    ? styles.activeLink
                    : styles.link
                }
              >
                My Bookings
              </NavLink>
            </nav>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}