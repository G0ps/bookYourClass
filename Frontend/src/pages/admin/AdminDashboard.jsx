import { useNavigate } from "react-router-dom";

import styles from "./AdminDashboard.module.css";
import UserManagement from "./UserManagement.jsx";
import VenueManagement from "./VenueManagement.jsx";
import BookingManagement from "./BookingManagement.jsx";

import { ENDPOINTS } from "../../endpoints";
import commonFunctions from "../commonFunctions.js"

export default function AdminDashboard() {

  const navigate = useNavigate();
  const handleLogout = commonFunctions.logout

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