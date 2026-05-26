import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import commonFunctions from "../commonFunctions.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {!open && (
        <button
          className={styles.openBtn}
          onClick={() => setOpen(true)}
        >
          ☰ <span>Menu</span>
        </button>
      )}

      <aside className={`${styles.panel} ${open ? styles.open : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
        >
          ✕ Close
        </button>

        <div className={styles.brandContainer}>
          <h2 className={styles.logo}>bookYourClass</h2>
          <span className={styles.badge}>Admin Center</span>
        </div>

        <nav className={styles.navGroup}>
          <button onClick={() => handleNav("/admin/users")}>
            Users
          </button>

          <button onClick={() => handleNav("/admin/venues")}>
            Venues
          </button>

          <button onClick={() => handleNav("/admin/bookings")}>
            Bookings
          </button>

          <button
            className={styles.logout}
            onClick={() => commonFunctions.logout(navigate)}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}