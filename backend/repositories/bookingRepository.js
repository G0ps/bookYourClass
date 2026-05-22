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

export default {
  insertNewBooking,
  updateBookingPatch,
  verifyStaffId,
  verifyVenueId,
};