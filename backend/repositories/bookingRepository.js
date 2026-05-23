import mainModel from "./models/mainModel.js";

const venueModel = mainModel.venueModel;
const userModel = mainModel.userModel;
const bookingModel = mainModel.bookingModel;

const insertNewBooking = async (data) => {
  try {
    const newBooking = new bookingModel(data);

    await newBooking.save();

    return {
      status: "success",
      bookingData: newBooking,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const updateBookingPatch = async (
  bookingId,
  updateData
) => {
  try {
    const updatedBooking =
      await bookingModel.findByIdAndUpdate(
        bookingId,
        { $set: updateData },
        { new: true }
      );

    return {
      status: "success",
      bookingData: updatedBooking,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const verifyStaffId = async (staffId) => {
  try {
    const users = await userModel.find({
      _id: staffId,
    });

    return users.length === 1;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const verifyVenueId = async (venueId) => {
  try {
    const venue = await venueModel.find({
      _id: venueId,
    });

    return venue.length === 1;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const fetchBookingsByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return {
        status: "error",
        message: "User not found",
      };
    }

    const bookings = await bookingModel.find({
      userId: user._id,
    });

    return {
      status: "success",
      bookings,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const fetchBookingsByVenueId = async (venueId) => {
  try {
    const bookings = await bookingModel.find({
      venueId,
    });

    return {
      status: "success",
      bookings,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const fetchBookingsByDates = async (startDate, endDate) => {
  try {
    const query = {};

    if (startDate) {
      query.startDate = {
        $gte: new Date(startDate),
      };
    }

    if (endDate) {
      query.endDate = {
        $lte: new Date(endDate),
      };
    }

    const bookings = await bookingModel.find(query);

    return {
      status: "success",
      bookings,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const fetchBookingsWithFilters = async ({
  email,
  venueId,
  startDate,
  endDate,
}) => {
  try {
    const query = {};

    if (email) {
      const user = await userModel.findOne({ email });

      if (!user) {
        return {
          status: "success",
          bookings: [],
        };
      }

      query.userId = user._id;
    }

    if (venueId) {
      query.venueId = venueId;
    }

    if (startDate || endDate) {
      query.startDate = {};

      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }

      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    const bookings = await bookingModel.find(query);

    return {
      status: "success",
      bookings,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

export default {
  insertNewBooking,
  updateBookingPatch,
  verifyStaffId,
  verifyVenueId,
  fetchBookingsByEmail,
  fetchBookingsByVenueId,
  fetchBookingsByDates,
  fetchBookingsWithFilters,
};