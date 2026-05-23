import styles from "./AdminDashboard.module.css";
import UserManagement from "./UserManagement.jsx";
import VenueManagement from "./VenueManagement.jsx";
import BookingManagement from "./BookingManagement.jsx";

import { ENDPOINTS } from "../../endpoints";

const handleLogout = async () => {
    try {
      await fetch(ENDPOINTS.AUTHENTICATION.LOGOUT, {
        method: "POST",
        credentials: "include",
      }).then(data => {
        localStorage.clear();
        sessionStorage.clear();

        window.history.replaceState(null, "", "/");

        navigate("/", { replace: true });
        return;
      });
    } catch (err) {
      console.log(err);
    }
  };

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <button onClick={handleLogout}>logout</button>
      <div className={styles.grid}>
        <UserManagement />
        <VenueManagement />
        <BookingManagement />
      </div>

    </div>
  );
}