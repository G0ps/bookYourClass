import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./Home.module.css";
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

      if (filters.search)
        query.append(
          "search",
          filters.search
        );

      if (filters.block)
        query.append(
          "block",
          filters.block
        );

      if (filters.capacity)
        query.append(
          "capacity",
          filters.capacity
        );

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
      )
        return false;

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
    () =>
      isDateOverlapping(),
    [bookingDates, bookedSlots]
  );

  return (
    <div
      className={
        styles.container
      }
    >
      <div
        className={
          styles.hero
        }
      >
        <h1>
          Campus Venue Booking
        </h1>

        <p>
          Reserve auditoriums,
          seminar halls and
          academic spaces with
          ease.
        </p>
      </div>

      <div
        className={
          styles.filters
        }
      >
        <input
          className={
            styles.input
          }
          placeholder="Search Venue"
          name="search"
          value={filters.search}
          onChange={
            handleFilterChange
          }
        />

        <input
          className={
            styles.input
          }
          placeholder="Block"
          name="block"
          value={filters.block}
          onChange={
            handleFilterChange
          }
        />

        <input
          className={
            styles.input
          }
          placeholder="Capacity"
          type="number"
          name="capacity"
          value={
            filters.capacity
          }
          onChange={
            handleFilterChange
          }
        />
      </div>

      {loading ? (
        <h2
          className={
            styles.loading
          }
        >
          Loading Venues...
        </h2>
      ) : (
        <div
          className={
            styles.venueGrid
          }
        >
          {venues.map(
            (venue) => (
              <div
                key={
                  venue._id
                }
                className={
                  styles.card
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <h2>
                    {
                      venue.name
                    }
                  </h2>

                  <span
                    className={
                      styles.capacityBadge
                    }
                  >
                    {
                      venue.capacity
                    }{" "}
                    Seats
                  </span>
                </div>

                <div
                  className={
                    styles.meta
                  }
                >
                  📍{" "}
                  {
                    venue.block
                  }
                </div>

                <div
                  className={
                    styles.staffList
                  }
                >
                  {venue.inchargeIds?.map(
                    (
                      staff
                    ) => (
                      <span
                        key={
                          staff._id
                        }
                        className={
                          styles.staffChip
                        }
                      >
                        {
                          staff.name
                        }
                      </span>
                    )
                  )}
                </div>

                <button
                  className={
                    styles.primaryBtn
                  }
                  onClick={() =>
                    openBookingModal(
                      venue
                    )
                  }
                >
                  Book Venue
                </button>
              </div>
            )
          )}
        </div>
      )}

      <div
        className={
          styles.pagination
        }
      >
        <button
          className={
            styles.primaryBtn
          }
          disabled={
            pagination.currentPage ===
            1
          }
          onClick={() =>
            setPagination(
              (
                prev
              ) => ({
                ...prev,
                currentPage:
                  prev.currentPage -
                  1,
              })
            )
          }
        >
          Prev
        </button>

        <span>
          {
            pagination.currentPage
          }{" "}
          /{" "}
          {
            pagination.totalPages
          }
        </span>

        <button
          className={
            styles.primaryBtn
          }
          disabled={
            pagination.currentPage ===
            pagination.totalPages
          }
          onClick={() =>
            setPagination(
              (
                prev
              ) => ({
                ...prev,
                currentPage:
                  prev.currentPage +
                  1,
              })
            )
          }
        >
          Next
        </button>
      </div>

      {selectedVenue && (
        <div
          className={
            styles.overlay
          }
        >
          <div
            className={
              styles.modal
            }
          >
            <h2>
              {
                selectedVenue.name
              }
            </h2>

            <input
              type="datetime-local"
              className={`${styles.input} ${
                overlap
                  ? styles.errorBorder
                  : ""
              }`}
              value={
                bookingDates.startDate
              }
              onChange={(
                e
              ) =>
                setBookingDates(
                  (
                    prev
                  ) => ({
                    ...prev,
                    startDate:
                      e.target
                        .value,
                  })
                )
              }
            />

            <input
              type="datetime-local"
              className={`${styles.input} ${
                overlap
                  ? styles.errorBorder
                  : ""
              }`}
              value={
                bookingDates.endDate
              }
              onChange={(
                e
              ) =>
                setBookingDates(
                  (
                    prev
                  ) => ({
                    ...prev,
                    endDate:
                      e.target
                        .value,
                  })
                )
              }
            />

            <h4>
              Unavailable
              Slots
            </h4>

            <div
              className={
                styles.slotList
              }
            >
              {bookedSlots.map(
                (
                  slot
                ) => (
                  <div
                    key={
                      slot._id
                    }
                    className={
                      styles.slot
                    }
                  >
                    {new Date(
                      slot.startDate
                    ).toLocaleString()}
                    {" - "}
                    {new Date(
                      slot.endDate
                    ).toLocaleString()}
                  </div>
                )
              )}
            </div>

            {overlap && (
              <p
                className={
                  styles.error
                }
              >
                Selected time
                overlaps with
                another booking
              </p>
            )}

            <div
              className={
                styles.modalActions
              }
            >
              <button
                className={
                  styles.primaryBtn
                }
                disabled={
                  overlap
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
                className={
                  styles.secondaryBtn
                }
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