// Home.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { ENDPOINTS } from "../../endpoints";

export default function Home() {

  const [venues, setVenues] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
    });

  const [loading, setLoading] =
    useState(false);

  const [selectedVenue,
    setSelectedVenue] =
    useState(null);

  const [bookingDates,
    setBookingDates] =
    useState({
      startDate: "",
      endDate: "",
    });

  const [bookedSlots,
    setBookedSlots] =
    useState([]);

  const [bookingLoading,
    setBookingLoading] =
    useState(false);

  const [filters, setFilters] =
    useState({
      search: "",
      block: "",
      capacity: "",
    });

  const fetchVenues = async () => {

    try {

      setLoading(true);

      const query =
        new URLSearchParams({
          page:
            pagination.currentPage,

          limit: 10,
        });

      if (filters.search) {
        query.append(
          "search",
          filters.search
        );
      }

      if (filters.block) {
        query.append(
          "block",
          filters.block
        );
      }

      if (filters.capacity) {
        query.append(
          "capacity",
          filters.capacity
        );
      }

      const response =
        await fetch(
          `${ENDPOINTS.VENUE.GET}?${query.toString()}`,
          {
            credentials:
              "include",
          }
        );

      const data =
        await response.json();

      if (
        data.status ===
        "success"
      ) {

        setVenues(
          data.venues || []
        );

        setPagination({
          currentPage:
            data.pagination
              ?.currentPage || 1,

          totalPages:
            data.pagination
              ?.totalPages || 1,
        });
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchVenues();

  }, [
    pagination.currentPage,
    filters.search,
    filters.block,
    filters.capacity,
  ]);

  const handleFilterChange = (
    e
  ) => {

    setFilters((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const openBookingModal =
    async (venue) => {

      try {

        setSelectedVenue(
          venue
        );

        const response =
          await fetch(
            `${ENDPOINTS.BOOKING.POST}?venueId=${venue._id}`,
            {
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (
          data.status ===
          "success"
        ) {
          setBookedSlots(
            data.bookings || []
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  const isDateOverlapping =
    () => {

      if (
        !bookingDates.startDate ||
        !bookingDates.endDate
      ) {
        return false;
      }

      const start =
        new Date(
          bookingDates.startDate
        );

      const end =
        new Date(
          bookingDates.endDate
        );

      return bookedSlots.some(
        (slot) => {

          const slotStart =
            new Date(
              slot.startDate
            );

          const slotEnd =
            new Date(
              slot.endDate
            );

          return (
            start < slotEnd &&
            end > slotStart
          );
        }
      );
    };

  const handleBooking =
    async () => {

      try {

        if (
          isDateOverlapping()
        ) {
          alert(
            "Selected timing overlaps with existing booking"
          );

          return;
        }

        setBookingLoading(
          true
        );

        const response =
          await fetch(
            ENDPOINTS.BOOKING.POST,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  venueId:
                    selectedVenue._id,

                  staffId:
                    localStorage.getItem(
                      "userId"
                    ),

                  startDate:
                    bookingDates.startDate,

                  endDate:
                    bookingDates.endDate,
                }),
            }
          );

        const data =
          await response.json();

        console.log(
          "response : ",
          data
        );

        if (
          data.status ===
          "success"
        ) {

          alert(
            "Venue booked"
          );

          setSelectedVenue(
            null
          );

          setBookingDates({
            startDate: "",
            endDate: "",
          });

          fetchVenues();

        } else {

          alert(
            data.message ||
              "Booking failed"
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setBookingLoading(
          false
        );
      }
    };

  const overlap = useMemo(
    () => {
      return isDateOverlapping();
    },
    [bookingDates, bookedSlots]
  );

  return (<div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        Venue Booking
      </h1>

      {/* filters */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <input
          style={inputStyle}
          placeholder="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <input
          style={inputStyle}
          placeholder="Block"
          name="block"
          value={filters.block}
          onChange={handleFilterChange}
        />

        <input
          style={inputStyle}
          placeholder="Capacity"
          name="capacity"
          type="number"
          value={filters.capacity}
          onChange={handleFilterChange}
        />
      </div>

      {/* cards */}

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {venues.map((venue) => (
            <div
              key={venue._id}
              style={cardStyle}
            >
              <h2>{venue.name}</h2>

              <p>
                Block : {venue.block}
              </p>

              <p>
                Capacity :{" "}
                {venue.capacity}
              </p>

              <div
                style={{
                  marginTop: "10px",
                }}
              >
                {venue.inchargeIds?.map(
                  (staff) => (
                    <div
                      key={staff._id}
                    >
                      {staff.name}
                    </div>
                  )
                )}
              </div>

              <button
                style={buttonStyle}
                onClick={() =>
                  openBookingModal(
                    venue
                  )
                }
              >
                Book Venue
              </button>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <button
          style={buttonStyle}
          disabled={
            pagination.currentPage === 1
          }
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage:
                prev.currentPage - 1,
            }))
          }
        >
          Prev
        </button>

        <div>
          {pagination.currentPage} /{" "}
          {pagination.totalPages}
        </div>

        <button
          style={buttonStyle}
          disabled={
            pagination.currentPage ===
            pagination.totalPages
          }
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage:
                prev.currentPage + 1,
            }))
          }
        >
          Next
        </button>
      </div>

      {/* modal */}

      {selectedVenue && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2>
              {selectedVenue.name}
            </h2>

            <p>
              Block :{" "}
              {selectedVenue.block}
            </p>

            <p>
              Capacity :{" "}
              {selectedVenue.capacity}
            </p>

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <label>
                Start Date
              </label>

              <input
                type="datetime-local"
                style={{
                  ...inputStyle,
                  border: overlap
                    ? "2px solid red"
                    : "1px solid #ccc",
                }}
                value={
                  bookingDates.startDate
                }
                onChange={(e) =>
                  setBookingDates(
                    (
                      prev
                    ) => ({
                      ...prev,
                      startDate:
                        e.target.value,
                    })
                  )
                }
              />
            </div>

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <label>
                End Date
              </label>

              <input
                type="datetime-local"
                style={{
                  ...inputStyle,
                  border: overlap
                    ? "2px solid red"
                    : "1px solid #ccc",
                }}
                value={
                  bookingDates.endDate
                }
                onChange={(e) =>
                  setBookingDates(
                    (
                      prev
                    ) => ({
                      ...prev,
                      endDate:
                        e.target.value,
                    })
                  )
                }
              />
            </div>

            {/* booked slots */}

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <h4>
                Unavailable Slots
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {bookedSlots.map(
                  (slot) => (
                    <div
                      key={slot._id}
                      style={{
                        background:
                          "#fee2e2",
                        color: "#991b1b",
                        padding:
                          "10px",
                        borderRadius:
                          "10px",
                      }}
                    >
                      {new Date(
                        slot.startDate
                      ).toLocaleString()}
                      {"  "}
                      -
                      {"  "}
                      {new Date(
                        slot.endDate
                      ).toLocaleString()}
                    </div>
                  )
                )}
              </div>
            </div>

            {overlap && (
              <p
                style={{
                  color: "red",
                  marginTop: "15px",
                }}
              >
                Selected timing overlaps
                with another booking
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "25px",
              }}
            >
              <button
                style={{
                  ...buttonStyle,
                  opacity: overlap
                    ? 0.5
                    : 1,
                }}
                disabled={
                  overlap ||
                  bookingLoading
                }
                onClick={
                  handleBooking
                }
              >
                {bookingLoading
                  ? "Booking..."
                  : "Confirm Booking"}
              </button>

              <button
                style={{
                  ...buttonStyle,
                  background:
                    "#e2e8f0",
                }}
                onClick={() =>
                  setSelectedVenue(
                    null
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginTop: "8px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  boxShadow:
    "0 4px 10px rgba(0,0,0,0.05)",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#bfdbfe",
  color: "#1d4ed8",
  fontWeight: "600",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "500px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "30px",
};