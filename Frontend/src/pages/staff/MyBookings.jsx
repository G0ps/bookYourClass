// src/pages/staff/MyBookings.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MyBookings.module.css";

import { ENDPOINTS } from "../../endpoints";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [filters, setFilters] = useState({
    email: "",
    venueId: "",
    startDate: "",
    endDate: "",
  });


  const handleUnauthorizedAccess = () => {
    
    handleLogout();
    localStorage.clear();
    sessionStorage.clear();

    window.history.replaceState(null, "", "/");

    navigate("/", { replace: true });
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

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorizedAccess();
        return;
      }

      const data = await response.json();
      console.log("data my bookings : " , data)

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
      <h1 className={styles.title}>
        My Bookings
      </h1>

      <div className={styles.filterContainer}>
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
      </div>

      <div className={styles.bookingGrid}>
        {bookings.map((booking) => (
          <div
            className={styles.card}
            key={booking._id}
          >
            <p>
              <strong>Booking Id:</strong>{" "}
              {booking._id}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {booking.status}
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
    </div>
  );
}