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
    ];
  }

  const skip = (page - 1) * limit;

  const users = await userModel
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUsers =
    await userModel.countDocuments(query);

  return {
    status: "success",
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(
        totalUsers / limit
      ),
      totalUsers,
      limit,
    },
  };
};

const patchUser = async (userId, data) => {
  try {
    const updatedUser =
      await userModel.findByIdAndUpdate(
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
    const deletedUser =
      await userModel.findByIdAndDelete(
        userId
      );

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

const invalidateUserBookings = async (
  userId
) => {
  try {
    const updatedBookings =
      await bookingModel.updateMany(
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