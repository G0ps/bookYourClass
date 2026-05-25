// src/pages/staff/MyBookings.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MyBookings.module.css";

import { ENDPOINTS } from "../../endpoints";
import commonFunctions from "../commonFunctions";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] =
  useState("pending");

  const [filters, setFilters] = useState({
    venueId: "",
    startDate: "",
    endDate: "",
  });


  const handleUnauthorizedAccess = commonFunctions.handleUnauthorizedAccess

  const cancelBooking = async (bookingId) => {
  try {

    const response = await fetch(
      `${ENDPOINTS.BOOKING.CANCEL}/${bookingId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );


      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorizedAccess(navigate);
        return;
      }

      const data = await response.json();
      console.log("response from booking cancelation : " , data)
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

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorizedAccess(navigate);
        return;
      }

      const data = await response.json();
      // console.log("data my bookings : " , data)

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

  const filteredBookings =
  bookings.filter(
    (booking) =>
      booking.status === activeTab
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        My Bookings
      </h1>
      <div className={styles.navContainer}>
  <button
    className={`${styles.navButton} ${
      activeTab === "pending"
        ? styles.activeNav
        : ""
    }`}
    onClick={() =>
      setActiveTab("pending")
    }
  >
    Pending
  </button>

  <button
    className={`${styles.navButton} ${
      activeTab === "cancelled"
        ? styles.activeNav
        : ""
    }`}
    onClick={() =>
      setActiveTab("cancelled")
    }
  >
    Cancelled
  </button>

  <button
      className={`${styles.navButton} ${
        activeTab === "rejected"
          ? styles.activeNav
          : ""
      }`}
      onClick={() =>
        setActiveTab("rejected")
      }
    >
      Rejected
    </button>
  </div>

      <div className={styles.filterContainer}>

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
        {filteredBookings.map((booking) => (
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

            {booking.status === "pending" && (
              <button
                onClick={() =>
                  cancelBooking(booking._id)
                }
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}