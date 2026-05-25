import mainModel from "./models/mainModel.js";

const userModel = mainModel.userModel;
const bookingModel = mainModel.bookingModel;

export const getUsers = async ({
  page,
  limit,
  typeOfUser,
  search,
}) => {
  const query = {};

  if (typeOfUser) {
    query.typeOfUser = typeOfUser;
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
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        contactNumber: {
          $regex: search,
          $options: "i",
        },
      },
      {
        _id: /^[0-9a-fA-F]{24}$/.test(search)
          ? search
          : undefined,
      },
    ];
  }

  const skip = (page - 1) * limit;

  // fetch extra data to compensate for filtering
  const rawUsers = await userModel
    .find(query)
    .skip(skip)
    .limit(limit * 2) // fetch extra to avoid losing results
    .sort({ name: 1 });

  // post-filter admin
  const users = rawUsers.filter(
    (user) => user.typeOfUser !== "admin"
  );

  const totalUsers = await userModel.countDocuments({
    ...query,
    typeOfUser: { $ne: "admin" }, // keep count accurate
  });

  return {
    status: "success",
    users: users.slice(0, limit), // enforce limit after filtering
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      limit,
    },
  };
};

const patchUser = async (userId, data) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );

    return {
      status: "success",
      updatedUser,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const deleteUser = async (userId) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);

    return {
      status: "success",
      deletedUser,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const invalidateUserBookings = async (userId) => {
  try {
    const updatedBookings = await bookingModel.updateMany(
      { staffId: userId },
      {
        $set: {
          status: "invalid",
        },
      }
    );

    return {
      status: "success",
      updatedBookings,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

export default {
  getUsers,
  patchUser,
  deleteUser,
  invalidateUserBookings,
};