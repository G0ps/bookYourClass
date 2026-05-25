import { useEffect, useState, useCallback } from "react";
import styles from "./BookingManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("pending");

  const [filters, setFilters] = useState({
    venueId: "",
    staffId: "",
    startDate: "",
    endDate: "",
  });

  const fetchBookings = useCallback(async () => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });

      const res = await fetch(
        `${ENDPOINTS.ADMIN.BOOKING.GET}?${query.toString()}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setBookings(data.bookings || []);
      console.log("bookings : " , data.bookings)
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBooking = async (bookingId, status) => {
    try {
      await fetch(
        `${ENDPOINTS.BOOKING.PATCH}/${bookingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (tab === "complete") return b.status === "complete";
    if (tab === "rejected") return b.status === "rejected";
    if (tab === "invalid") return b.status === "invalid";
    if (tab === "canceled") return b.status === "canceled";
    return b.status === "pending";
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Booking Management</h1>

      {/* FILTERS (no status dropdown anymore) */}
      <div className={styles.filterBox}>
        <input
          placeholder="Venue ID"
          value={filters.venueId}
          onChange={(e) =>
            setFilters({ ...filters, venueId: e.target.value })
          }
          className={styles.input}
        />

        <input
          placeholder="Staff ID"
          value={filters.staffId}
          onChange={(e) =>
            setFilters({ ...filters, staffId: e.target.value })
          }
          className={styles.input}
        />

        <input
          type="datetime-local"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className={styles.input}
        />

        <input
          type="datetime-local"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
          className={styles.input}
        />

        <button onClick={fetchBookings} className={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* TABS */}
      <div className={styles.toggleBar}>
        {["pending", "complete", "rejected", "invalid", "canceled"].map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${styles.tab} ${
                tab === t ? styles.activeTab : ""
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          )
        )}
      </div>

      {/* BOOKINGS */}
      <div className={styles.bookingSection}>
        {filteredBookings.map((b) => (
          <div key={b._id} className={styles.card}>
            <div>
              <span>Booking ID:</span> {b._id}
            </div>

            <div>
              <span>Venue:</span>{" "}
              {b.venueId?.name || b.venueId}
            </div>
            <div>
              <span>venue Name:</span> {b.venueName}
            </div>

            <div>
              <span>Staff:</span>{" "}
              {b.staffId?.name || b.staffId}
            </div>
            <div>
              <span>Staff Name:</span> {b.staffName}
            </div>

            <div>
              <span>Status:</span> {b.status}
            </div>

            <div>
              <span>Start:</span>{" "}
              {new Date(b.startDate).toLocaleString()}
            </div>

            <div>
              <span>End:</span>{" "}
              {new Date(b.endDate).toLocaleString()}
            </div>

            <div className={styles.actions}>
              {b.status === "pending" && (
                <button
                  className={styles.acceptBtn}
                  onClick={() =>
                    updateBooking(b._id, "complete")
                  }
                >
                  Complete
                </button>
              )}

              {(b.status === "pending" ||
                b.status === "complete") && (
                <button
                  className={styles.rejectBtn}
                  onClick={() =>
                    updateBooking(b._id, "rejected")
                  }
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}