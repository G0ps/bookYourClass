// src/pages/staff/StaffDashboard.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./StaffDashboard.module.css";
import commonFunctions from "../commonFunctions";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <button
            className={styles.toggleBtn}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
          {sidebarOpen && (
            <div className={styles.brandContainer}>
              <h2 className={styles.heading}>Staff Portal</h2>
              <span className={styles.subHeading}>Premium Venues</span>
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        <nav className={styles.navLinks}>
          <NavLink
            to="/staff/home"
            end
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            <span className={`${styles.icon} ${styles.goldIcon}`}>⌂</span>
            {sidebarOpen && <span className={styles.linkLabel}>Home Console</span>}
          </NavLink>

          <NavLink
            to="/staff/myBookings"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            <span className={`${styles.icon} ${styles.silverIcon}`}>📅</span>
            {sidebarOpen && <span className={styles.linkLabel}>My Bookings</span>}
          </NavLink>
        </nav>

        <button
          className={`${styles.logoutBtn} ${!sidebarOpen ? styles.logoutBtnClosed : ""}`}
          onClick={() => commonFunctions.logout(navigate)}
          title="Sign Out of Panel"
        >
          <span className={styles.logoutIcon}>⎋</span>
          {sidebarOpen && <span className={styles.logoutLabel}>Exit Console</span>}
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.systemStatus}>
            <span className={styles.statusIndicator}></span>
            System Engine Active
          </div>
          <div className={styles.userProfileBadge}>
            <div className={styles.avatar}>ST</div>
            <span>Staff Account</span>
          </div>
        </header>
        <div className={styles.viewContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}