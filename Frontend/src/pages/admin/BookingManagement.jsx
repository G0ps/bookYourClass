import { useEffect, useState } from "react";
import styles from "./BookingManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    venueId: "",
    startDate: "",
    endDate: "",
  });

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const query = new URLSearchParams();

      if (filters.email) query.append("email", filters.email);
      if (filters.venueId) query.append("venueId", filters.venueId);
      if (filters.startDate) query.append("startDate", filters.startDate);
      if (filters.endDate) query.append("endDate", filters.endDate);

      const res = await fetch(
        `${ENDPOINTS.BOOKING.GET}?${query.toString()}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // PATCH BOOKING (example: status update or partial update)
  const updateBooking = async (bookingId, updateData) => {
    try {
      await fetch(`${ENDPOINTS.BOOKING.PATCH}?bookingId=${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Booking Management</h2>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) =>
            setFilters({ ...filters, email: e.target.value })
          }
        />

        <input
          placeholder="Venue ID"
          value={filters.venueId}
          onChange={(e) =>
            setFilters({ ...filters, venueId: e.target.value })
          }
        />

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <button onClick={fetchBookings}>Search</button>
      </div>

      {/* BOOKINGS LIST */}
      <div className={styles.list}>
        {bookings.map((b) => (
          <div key={b._id} className={styles.card}>
            <div>
              <strong>Venue:</strong> {b.venueId}
            </div>
            <div>
              <strong>Staff:</strong> {b.staffId}
            </div>
            <div>
              <strong>Start:</strong>{" "}
              {new Date(b.startDate).toLocaleString()}
            </div>
            <div>
              <strong>End:</strong>{" "}
              {new Date(b.endDate).toLocaleString()}
            </div>

            {/* EXAMPLE ADMIN ACTION */}
            <div className={styles.actions}>
              <button
                onClick={() =>
                  updateBooking(b._id, { status: "approved" })
                }
              >
                Approve
              </button>

              <button
                onClick={() =>
                  updateBooking(b._id, { status: "rejected" })
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}