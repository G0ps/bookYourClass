import mainModel from "./models/mainModel.js";

const venueModel = mainModel.venueModel;
const userModel = mainModel.userModel;

const insertNewVenue = async (data) => {
  try {
    const newVenue = new venueModel(data);

    await newVenue.save();

    return {
      status: "success",
      newVenue,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const verifyStaffIds = async (staffIds) => {
  try {
    const users = await userModel.find({
      _id: { $in: staffIds },
    });

    return users.length === staffIds.length;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const updateVenuePatch = async (venueId, data) => {
  try {
    const updatedVenue = await venueModel.findByIdAndUpdate(
      venueId,
      { $set: data },
      { new: true }
    );

    return {
      status: "success",
      updatedVenue,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const replaceVenuePut = async (venueId, data) => {
  try {
    const replacedVenue = await venueModel.findOneAndReplace(
      { _id: venueId },
      data,
      { new: true }
    );

    return {
      status: "success",
      replacedVenue,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const deleteVenueById = async (venueId) => {
  try {
    const deletedVenue = await venueModel.findByIdAndDelete(
      venueId
    );

    return {
      status: "success",
      deletedVenue,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

export default {
  insertNewVenue,
  verifyStaffIds,
  updateVenuePatch,
  replaceVenuePut,
  deleteVenueById,
};