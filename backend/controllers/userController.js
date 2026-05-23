import userRepository from "../repositories/userRepository.js";

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
        _id: search.match(/^[0-9a-fA-F]{24}$/)
          ? search
          : null,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await userModel
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 });

  const totalUsers =
    await userModel.countDocuments(
      query
    );

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


export const patchUser = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

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
    const userId = req.user._id;

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
