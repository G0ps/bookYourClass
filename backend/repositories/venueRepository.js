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

export const getVenues = async ({
  page,
  limit,
  block,
  search,
}) => {
  const query = {};

  if (block) {
    query.block = block;
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        block: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const venues = await venueModel
    .find(query)
    .populate(
      "inchargeIds",
      "name email"
    )
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 });

  const totalVenues =
    await venueModel.countDocuments(
      query
    );

  return {
    status: "success",
    venues,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(
        totalVenues / limit
      ),
      totalVenues,
      limit,
    },
  };
};

export default {
  insertNewVenue,
  verifyStaffIds,
  updateVenuePatch,
  replaceVenuePut,
  deleteVenueById,
  getVenues,
};