// src/pages/staff/StaffDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StaffDashboard.module.css";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({
    email: "",
    venueId: "",
    startDate: "",
    endDate: "",
  });

  const handleUnauthorizedAccess = () => {
    // clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();

      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // clear storage
    localStorage.clear();
    sessionStorage.clear();

    // clear history + redirect
    window.history.replaceState(null, "", "/");

    navigate("/", { replace: true });
  };

  const fetchBookings = async () => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/booking?${query.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      // unauthorized / unauthenticated
      if (response.status === 401 || response.status === 403) {
        handleUnauthorizedAccess();
        return;
      }

      const data = await response.json();

      if (
        data.status === "unauthorized" ||
        data.status === "unauthenticated"
      ) {
        handleUnauthorizedAccess();
        return;
      }

      if (data.status === "success") {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
      handleUnauthorizedAccess();
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
            <h2>Filters</h2>

            <input
              type="text"
              name="email"
              placeholder="User Email"
              value={filters.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="venueId"
              placeholder="Venue Id"
              value={filters.venueId}
              onChange={handleChange}
            />

            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />

            <button onClick={fetchBookings}>
              Apply Filters
            </button>
          </>
        )}
      </aside>

      <main className={styles.main}>
        <h1>Staff Dashboard</h1>

        <div className={styles.bookingGrid}>
          {bookings.map((booking) => (
            <div className={styles.card} key={booking._id}>
              <p>
                <strong>Booking Id:</strong> {booking._id}
              </p>

              <p>
                <strong>Status:</strong> {booking.status}
              </p>

              <p>
                <strong>Venue:</strong>{" "}
                {booking.venueId?.join(", ")}
              </p>

              <p>
                <strong>Start:</strong>{" "}
                {new Date(
                  booking.startDate
                ).toLocaleString()}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {new Date(
                  booking.endDate
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}