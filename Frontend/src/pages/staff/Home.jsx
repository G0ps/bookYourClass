// src/pages/staff/Home.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./Home.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingDates, setBookingDates] = useState({ startDate: "", endDate: "" });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", block: "", capacity: "" });

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "10",
      });

      if (filters.search) query.append("search", filters.search);
      if (filters.block) query.append("block", filters.block);
      if (filters.capacity) query.append("capacity", filters.capacity);

      const response = await fetch(`${ENDPOINTS.VENUE.GET}?${query.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success") {
        setVenues(data.venues || []);
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [pagination.currentPage, filters.search, filters.block, filters.capacity]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openBookingModal = async (venue) => {
    try {
      setSelectedVenue(venue);
      const response = await fetch(`${ENDPOINTS.BOOKING.POST}?venueId=${venue._id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setBookedSlots(data.bookings || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isDateOverlapping = () => {
    if (!bookingDates.startDate || !bookingDates.endDate) return false;
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);

    return bookedSlots.some((slot) => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);
      return start < slotEnd && end > slotStart;
    });
  };

  const handleBooking = async () => {
    try {
      if (isDateOverlapping()) {
        alert("Selected timing overlaps with existing booking");
        return;
      }
      setBookingLoading(true);
      const response = await fetch(ENDPOINTS.BOOKING.POST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          venueId: selectedVenue._id,
          staffId: localStorage.getItem("userId"),
          startDate: bookingDates.startDate,
          endDate: bookingDates.endDate,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Venue allocation successfully processed.");
        setSelectedVenue(null);
        setBookingDates({ startDate: "", endDate: "" });
        fetchVenues();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  const overlap = useMemo(() => isDateOverlapping(), [bookingDates, bookedSlots]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>SEARCH</h1>
      </div>

      <div className={styles.filters}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="Search allocation name..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="Infrastructure Block"
            name="block"
            value={filters.block}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="Minimum Capacity"
            type="number"
            name="capacity"
            value={filters.capacity}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <h2>Querying Infrastructure Data...</h2>
        </div>
      ) : (
        <div className={styles.venueGrid}>
          {venues.map((venue) => (
            <div key={venue._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{venue.name}</h2>
                <span className={styles.capacityBadge}>
                  {venue.capacity} seating units
                </span>
              </div>

              <div className={styles.meta}>
                <span className={styles.locationPin}>📍</span> Layout Location: <strong>{venue.block}</strong>
              </div>

              <div className={styles.staffHeading}>Assigned Space Supervisors:</div>
              <div className={styles.staffList}>
                {venue.inchargeIds && venue.inchargeIds.length > 0 ? (
                  venue.inchargeIds.map((staff) => (
                    <span key={staff._id} className={styles.staffChip}>
                      {staff.name}
                    </span>
                  ))
                ) : (
                  <span className={styles.noStaff}>No standard managers specified</span>
                )}
              </div>

              <button className={styles.primaryBtn} onClick={() => openBookingModal(venue)}>
                Initiate Allocation Request
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={pagination.currentPage === 1}
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
        >
          🡨 Previous Page
        </button>
        <span className={styles.pageIndicator}>
          Index <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
        </span>
        <button
          className={styles.pageBtn}
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        >
          Next Page 🡪
        </button>
      </div>

      {selectedVenue && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Allocation Schedule: {selectedVenue.name}</h2>
              <button className={styles.closeX} onClick={() => setSelectedVenue(null)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.inputLabel}>Required Start Timestamp</label>
              <input
                type="datetime-local"
                className={`${styles.modalInput} ${overlap ? styles.errorBorder : ""}`}
                value={bookingDates.startDate}
                onChange={(e) => setBookingDates((prev) => ({ ...prev, startDate: e.target.value }))}
              />

              <label className={styles.inputLabel}>Required Conclusion Timestamp</label>
              <input
                type="datetime-local"
                className={`${styles.modalInput} ${overlap ? styles.errorBorder : ""}`}
                value={bookingDates.endDate}
                onChange={(e) => setBookingDates((prev) => ({ ...prev, endDate: e.target.value }))}
              />

              <h4 className={styles.slotsHeading}>Current Confirmed Bookings</h4>
              <div className={styles.slotList}>
                {bookedSlots.length > 0 ? (
                  bookedSlots.map((slot) => (
                    <div key={slot._id} className={styles.slot}>
                      <span className={styles.dot}></span>
                      {new Date(slot.startDate).toLocaleString()} — {new Date(slot.endDate).toLocaleString()}
                    </div>
                  ))
                ) : (
                  <div className={styles.emptySlots}>No active timelines reserved for this venue.</div>
                )}
              </div>

              {overlap && (
                <div className={styles.errorBanner}>
                  ⚠️ Conflict Alert: Selected dates overlap an active booking.
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.confirmBtn}
                disabled={overlap || !bookingDates.startDate || !bookingDates.endDate}
                onClick={handleBooking}
              >
                {bookingLoading ? "Processing Request..." : "Confirm Schedule Request"}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setSelectedVenue(null)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}