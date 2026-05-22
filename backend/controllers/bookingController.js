import venueRepository from "../repositories/venueRepository.js";

export const requestVenue = async (req, res) => {
  try {
    const {
      venueId,
      staffId,
      startDate,
      endDate,
    } = req.body;

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
      await venueRepository.verifyStaffId(
        staffId
      );

    if (!staffExists) {
      return res.status(400).json({
        status: "error",
        message: "Invalid staffId",
      });
    }

    const venueExists =
      await venueRepository.verifyVenueId(
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

    const response =
      await venueRepository.insertNewBooking(
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

export const patchBooking = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.params;

    const updateData = req.body;

    if (
      updateData.startDate &&
      updateData.endDate
    ) {
      const start = new Date(
        updateData.startDate
      );

      const end = new Date(
        updateData.endDate
      );

      if (start >= end) {
        return res.status(400).json({
          status: "error",
          message:
            "startDate must be lesser than endDate",
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

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};