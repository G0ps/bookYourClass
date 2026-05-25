import bookingRepository from "../repositories/bookingRepository.js";

export const requestVenue = async (req, res) => {
  try {
    const {
      venueId,
      startDate,
      endDate,
    } = req.body; 

    const staffId = req.user.userId

    const missingFields = [];

    if (!venueId) missingFields.push("venueId");
    if (!staffId) missingFields.push("staffId");
    if (!startDate) missingFields.push("startDate");
    if (!endDate) missingFields.push("endDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        missingFields,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        status: "error",
        message:
          "startDate must be lesser than endDate",
      });
    }

    const staffExists =
      await bookingRepository.verifyStaffId(
        staffId
      );

    if (!staffExists) {
      return res.status(400).json({
        status: "error",
        message: "Invalid staffId",
      });
    }

    const venueExists =
      await bookingRepository.verifyVenueId(
        venueId
      );

    if (!venueExists) {
      return res.status(400).json({
        status: "error",
        message: "Invalid venueId",
      });
    }

    const data = {
      venueId,
      staffId,
      startDate,
      endDate,
    };

    const overlapResponse =
      await bookingRepository.checkVenueBookingOverlap(
        {
          venueId,
          startDate,
          endDate,
        }
      );

    if (overlapResponse.hasOverlap) {
      return res.status(409).json({
        status: "error",
        message:
          "This booking overlaps with an existing booking",

        overlappingBookings:
          overlapResponse.overlappingBookings.map(
            (booking) => ({
              bookingId: booking._id,
              startDate:
                booking.startDate,
              endDate: booking.endDate,
            })
          ),
      });
    }

    const response =
      await bookingRepository.insertNewBooking(
        data
      );

    return res.status(201).json({
      status: response.status,
      bookingData: response.bookingData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const patchBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.endDate);

      if (start >= end) {
        return res.status(400).json({
          status: "error",
          message: "startDate must be lesser than endDate",
        });
      }
    }

    if (updateData.staffId) {
      const staffExists =
        await bookingRepository.verifyStaffId(
          updateData.staffId
        );

      if (!staffExists) {
        return res.status(400).json({
          status: "error",
          message: "Invalid staffId",
        });
      }
    }

    if (updateData.venueId) {
      const venueExists =
        await bookingRepository.verifyVenueId(
          updateData.venueId
        );

      if (!venueExists) {
        return res.status(400).json({
          status: "error",
          message: "Invalid venueId",
        });
      }
    }

    const response =
      await bookingRepository.updateBookingPatch(
        bookingId,
        updateData
      );

    if (response.status === "error") {
      return res.status(400).json(response);
    }

    // If booking is approved/completed
    if (updateData.status === "complete") {
      await bookingRepository.rejectOverlappingBookings(
        response.bookingData
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllBookingsOfStaff = async (req, res) => {
  try {
    const {
      venueId,
      startDate,
      endDate,
      status,
    } = req.query;

    const staffId = req.user.userId

    const response =
      await bookingRepository.fetchBookingsWithFilters(
        {
          venueId,
          staffId,
          startDate,
          endDate,
          status,
        }
      );

    if (response.status === "error") {
      console.log("error : " , response)
      return res.status(500).json(response);
    }
    
    return res.status(200).json({
      status: "success",
      bookings: response.bookings,
    });
  } catch (error) {
    console.log("error" , error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const {
      venueId,
      startDate,
      endDate,
      staffId,
      status,
    } = req.query;

    const response =
      await bookingRepository.fetchBookingsWithFilters(
        {
          venueId,
          staffId,
          startDate,
          endDate,
          status,
        }
      );

    if (response.status === "error") {
      console.log("error : " , response)
      return res.status(500).json(response);
    }
    
    return res.status(200).json({
      status: "success",
      bookings: response.bookings,
    });
  } catch (error) {
    console.log("error" , error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

// cancel booking 
export const cancelBooking = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.params;
    const updateData = {status : "canceled"};
    

    const response =
      await bookingRepository.cancelBooking(
        bookingId,
        updateData,
        req.user.userId
      );

       if (response.status === "error") {
        console.log("error : " , response)
        return res.status(500).json(response);
      }

      return res.status(200).json(response);
  }
  catch(error)
  {
    console.log("error" , error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
}
