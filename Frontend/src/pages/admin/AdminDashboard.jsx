import styles from "./AdminDashboard.module.css";
import UserManagement from "./UserManagement";
import VenueManagement from "./VenueManagement";
import BookingManagement from "./BookingManagement";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.grid}>
        <UserManagement />
        <VenueManagement />
        <BookingManagement />
      </div>
    </div>
  );
}