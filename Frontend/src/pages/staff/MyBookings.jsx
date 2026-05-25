// src/pages/staff/MyBookings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyBookings.module.css";
import { ENDPOINTS } from "../../endpoints";
import commonFunctions from "../commonFunctions";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [filters, setFilters] = useState({
    venueId: "",
    startDate: "",
    endDate: "",
  });

  const handleUnauthorizedAccess = commonFunctions.handleUnauthorizedAccess;

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${ENDPOINTS.BOOKING.CANCEL}/${bookingId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorizedAccess(navigate);
        return;
      }

      const data = await response.json();
      console.log("response from booking cancelation : ", data);
      if (data.status === "success") {
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query.append(key, value);
        }
      });

      const response = await fetch(
        `${ENDPOINTS.BOOKING.GET}?${query.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorizedAccess(navigate);
        return;
      }

      const data = await response.json();

      if (
        data.status === "unauthorized" ||
        data.status === "unauthenticated"
      ) {
        handleUnauthorizedAccess(navigate);
        return;
      }

      if (data.status === "success") {
        setBookings([...data.bookings]);
      }
    } catch (error) {
      console.error(error);
      handleUnauthorizedAccess(navigate);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Allocation Logs</h1>
      
      <div className={styles.navContainer}>
        <button
          className={`${styles.navButton} ${
            activeTab === "pending" ? styles.activeNav : ""
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>

        <button
          className={`${styles.navButton} ${
            activeTab === "cancelled" ? styles.activeNav : ""
          }`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>

        <button
          className={`${styles.navButton} ${
            activeTab === "cancelled" ? styles.activeNav : ""
          }`}
          onClick={() => setActiveTab("complete")}
        >
          Cancelled
        </button>

        <button
          className={`${styles.navButton} ${
            activeTab === "rejected" ? styles.activeNav : ""
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      <div className={styles.filterContainer}>
        <input
          type="text"
          name="venueId"
          className={styles.input}
          placeholder="Search Venue Reference ID"
          value={filters.venueId}
          onChange={handleChange}
        />

        <input
          type="date"
          name="startDate"
          className={styles.input}
          value={filters.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          className={styles.input}
          value={filters.endDate}
          onChange={handleChange}
        />

        <button className={styles.filterBtn} onClick={fetchBookings}>
          Apply Timeline Filter
        </button>
      </div>

      <div className={styles.bookingGrid}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div className={styles.card} key={booking._id}>
              <div className={styles.cardHeader}>
                <p className={styles.idLabel}>
                  <strong>ID:</strong> {booking._id}
                </p>
                <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className={styles.infoLine}>
                <strong>Venue Targets:</strong>{" "}
                <span className={styles.darkText}>
                  {booking.venueId?.join(", ") || "Unspecified Space"}
                </span>
              </div>

              <div className={styles.infoLine}>
                <strong>Start Window:</strong>{" "}
                <span className={styles.darkText}>
                  {new Date(booking.startDate).toLocaleString()}
                </span>
              </div>

              <div className={styles.infoLine}>
                <strong>End Window:</strong>{" "}
                <span className={styles.darkText}>
                  {new Date(booking.endDate).toLocaleString()}
                </span>
              </div>

              {booking.status === "pending" && (
                <button
                  className={styles.cancelBtn}
                  onClick={() => cancelBooking(booking._id)}
                >
                  Terminate Request
                </button>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            No reservation entries matched under this catalog tab.
          </div>
        )}
      </div>
    </div>
  );
}