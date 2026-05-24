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

  return <div>YOUR JSX SAME</div>;
}