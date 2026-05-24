import { useEffect, useState } from "react";
import styles from "./BookingManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function BookingManagement() {
  const [bookings, setBookings] =
    useState([]);

  const [tab, setTab] =
    useState("pending");

  const [filters, setFilters] =
    useState({
      venueId: "",
      staffId: "",
      startDate: "",
      endDate: "",
      status: "",
    });

  const fetchBookings = async () => {
    try {
      const query =
        new URLSearchParams();

      Object.entries(filters).forEach(
        ([key, value]) => {
          if (value) {
            query.append(key, value);
          }
        }
      );

      const res = await fetch(
        `${ENDPOINTS.ADMIN.BOOKING.GET}?${query.toString()}`,
        {
          credentials: "include",
        }
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

  const updateBooking = async (
    bookingId,
    status
  ) => {
    try {
      await fetch(
        `${ENDPOINTS.BOOKING.PATCH}/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings =
    bookings.filter((b) => {
      if (tab === "accepted") {
        return b.status === "complete";
      }

      if (tab === "rejected") {
        return b.status === "rejected";
      }

      return b.status === "pending";
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Booking Management
      </h1>

      <div className={styles.filterBox}>
        <input
          placeholder="Venue ID"
          value={filters.venueId}
          onChange={(e) =>
            setFilters({
              ...filters,
              venueId: e.target.value,
            })
          }
          className={styles.input}
        />

        <input
          placeholder="Staff ID"
          value={filters.staffId}
          onChange={(e) =>
            setFilters({
              ...filters,
              staffId: e.target.value,
            })
          }
          className={styles.input}
        />

        <input
          type="datetime-local"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              startDate:
                e.target.value,
            })
          }
          className={styles.input}
        />

        <input
          type="datetime-local"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              endDate:
                e.target.value,
            })
          }
          className={styles.input}
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
          className={styles.input}
        >
          <option value="">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="complete">
            Complete
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="invalid">
            Invalid
          </option>

          <option value="canceled">
            Canceled
          </option>
        </select>

        <button
          onClick={fetchBookings}
          className={styles.searchBtn}
        >
          Search
        </button>
      </div>

      <div className={styles.toggleBar}>
        <button
          className={
            tab === "pending"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("pending")
          }
        >
          Pending
        </button>

        <button
          className={
            tab === "accepted"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("accepted")
          }
        >
          Accepted
        </button>

        <button
          className={
            tab === "rejected"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("rejected")
          }
        >
          Rejected
        </button>
      </div>

      <div className={styles.bookingSection}>
        {filteredBookings.map((b) => (
          <div
            key={b._id}
            className={styles.card}
          >
            <div>
              <span>Booking ID:</span>{" "}
              {b._id}
            </div>

            <div>
              <span>Venue ID:</span>{" "}
              {b.venueId}
            </div>

            <div>
              <span>Staff ID:</span>{" "}
              {b.staffId}
            </div>

            <div>
              <span>Status:</span>{" "}
              {b.status}
            </div>

            <div>
              <span>Start:</span>{" "}
              {new Date(
                b.startDate
              ).toLocaleString()}
            </div>

            <div>
              <span>End:</span>{" "}
              {new Date(
                b.endDate
              ).toLocaleString()}
            </div>

            {b.status === "pending" && (
              <div
                className={
                  styles.actions
                }
              >
                <button
                  className={
                    styles.acceptBtn
                  }
                  onClick={() =>
                    updateBooking(
                      b._id,
                      "complete"
                    )
                  }
                >
                  Accept
                </button>

                <button
                  className={
                    styles.rejectBtn
                  }
                  onClick={() =>
                    updateBooking(
                      b._id,
                      "rejected"
                    )
                  }
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}