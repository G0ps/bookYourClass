import userRepository from "../repositories/userRepository.js";

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      typeOfUser,
      search,
    } = req.query;

    const response = await userRepository.getUsers({
      page: Number(page),
      limit: Number(limit),
      typeOfUser,
      search,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const patchUser = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;
    const {
      name,
      email,
      contactNumber,
      password,
      typeOfUser,
    } = req.body;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");

    if (!contactNumber)
      missingFields.push("contactNumber");

    if (!password)
      missingFields.push("password");

    if (!typeOfUser)
      missingFields.push("typeOfUser");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        missingFields,
      });
    }

    if (
      !["student", "staff"].includes(
        typeOfUser
      )
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid typeOfUser",
      });
    }

    const updateData = {
      name,
      email,
      contactNumber,
      password,
      typeOfUser,
    };

    const response =
      await userRepository.patchUser(
        userId,
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

export const deleteUser = async (
  req,
  res
) => {
  try {
    const userId = req.params.userId;

    await userRepository.invalidateUserBookings(userId);
    const response =
      await userRepository.deleteUser(
        userId
      );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
