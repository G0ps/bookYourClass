import Fuse from "fuse.js";

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
    if(staffIds === []) return true;
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
  inchargeName,
  inchargeId,
  capacity,
}) => {
  const query = {};

  if (block) {
    query.block = {
      $regex: block,
      $options: "i",
    };
  }

  if (capacity) {
    query.capacity = {
      $gte: Number(capacity),
    };
  }

  if (inchargeId) {
    const idsArray =
      inchargeId.split(",");

    query.inchargeIds = {
      $in: idsArray,
    };
  }

  let inchargeUsers = [];

  if (inchargeName) {
    inchargeUsers =
      await userModel.find({
        name: {
          $regex: inchargeName,
          $options: "i",
        },
      });

    query.inchargeIds = {
      $in: inchargeUsers.map(
        (u) => u._id
      ),
    };
  }

  const skip = (page - 1) * limit;

  let venues = await venueModel
    .find(query)
    .populate(
      "inchargeIds",
      "name email"
    )
    .lean();

    if (search) {
      const fuse = new Fuse(venues, {
        keys: [
          "name",
          "block",
        ],
        threshold: 0.4,
        includeScore: true,
      });

      venues = fuse
        .search(search)
        .map(
          (result) => result.item
        );
    }
  
  const totalVenues =
    venues.length;

  venues = venues.slice(
    skip,
    skip + limit
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