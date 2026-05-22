import mainModel from "./models/mainModel.js";

const userModel = mainModel.userModel;
const bookingModel = mainModel.bookingModel;

const getUsers = async () => {
  try {
    const users = await userModel.find();

    return {
      status: "success",
      users,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
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