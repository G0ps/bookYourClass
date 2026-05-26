// BookingManagement.jsx

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookingManagement.module.css";
import { ENDPOINTS } from "../../endpoints.js";
import commonFunctions from "../commonFunctions.js";

export default function BookingManagement() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("pending");
  const [filters, setFilters] = useState({
    venueId: "",
    staffId: "",
    startDate: "",
    endDate: "",
  });

  const fetchBookings = useCallback(
    async (appliedFilters = filters) => {
      try {
        const query = new URLSearchParams();

        Object.entries(appliedFilters).forEach(([key, value]) => {
          if (value) query.append(key, value);
        });

        const res = await fetch(
          `${ENDPOINTS.ADMIN.BOOKING.GET}?${query.toString()}`,
          {
            credentials: "include",
          }
        );

        if (res.status === 401 || res.status === 403) {
          await commonFunctions.handleUnauthorizedAccess(navigate);
          return;
        }

        const data = await res.json();

        setBookings(data.bookings || []);
        console.log("bookings : ", data.bookings);
      } catch (err) {
        console.error(err);
      }
    },
    [filters, navigate]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBooking = async (bookingId, status) => {
    try {
      const res = await fetch(
        `${ENDPOINTS.BOOKING.PATCH}/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        await commonFunctions.handleUnauthorizedAccess(navigate);
        return;
      }

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

      {/* FILTERS */}
      <div className={styles.filterBox}>
        <div className={styles.inputField}>
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
        </div>

        <div className={styles.inputField}>
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
        </div>

        <div className={styles.inputField}>
          <input
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({
                ...filters,
                startDate: e.target.value,
              })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.inputField}>
          <input
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({
                ...filters,
                endDate: e.target.value,
              })
            }
            className={styles.input}
          />
        </div>

        <button
          onClick={() => fetchBookings(filters)}
          className={styles.searchBtn}
        >
          Search
        </button>
      </div>

      {/* TABS */}
      <div className={styles.toggleBar}>
        {[
          "pending",
          "complete",
          "rejected",
          "invalid",
          "canceled",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`${styles.tab} ${
              tab === t ? styles.activeTab : ""
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      <div className={styles.bookingSection}>
        {filteredBookings.length === 0 ? (
          <div className={styles.noData}>
            No bookings found under this status.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.idLabel}>
                  ID: {b._id}
                </span>

                <span
                  className={`${styles.statusBadge} ${
                    styles[b.status] || ""
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.label}>Venue:</span>

                  <div className={styles.valueInfo}>
                    <p className={styles.mainVal}>
                      {b.venueName || "Unnamed Venue"}
                    </p>

                    <p className={styles.subVal}>
                      {b.venueId?.name || b.venueId}
                    </p>
                  </div>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.label}>Staff:</span>

                  <div className={styles.valueInfo}>
                    <p className={styles.mainVal}>
                      {b.staffName || "N/A"}
                    </p>

                    <p className={styles.subVal}>
                      {b.staffId?.name || b.staffId}
                    </p>
                  </div>
                </div>

                <div className={styles.timeBlock}>
                  <div className={styles.timeCol}>
                    <span className={styles.timeLabel}>
                      Start Time
                    </span>

                    <span className={styles.timeValue}>
                      {new Date(
                        b.startDate
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.timeCol}>
                    <span className={styles.timeLabel}>
                      End Time
                    </span>

                    <span className={styles.timeValue}>
                      {new Date(
                        b.endDate
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
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
          ))
        )}
      </div>
    </div>
  );
}