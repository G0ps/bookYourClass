import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

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

export const patchUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 1. Changed const to let to allow password re-assignment
    let {
      name,
      email,
      contactNumber,
      password,
      typeOfUser,
    } = req.body;

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    // 2. Build the update object dynamically to avoid passing 'undefined' fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (password !== undefined) updateData.password = password;
    if (typeOfUser !== undefined) updateData.typeOfUser = typeOfUser;

    // Check if the body actually contained any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: "error", message: "No update fields provided" });
    }

    const response = await userRepository.patchUser(userId, updateData);

    // Optional: Handle 404 if user didn't exist (depends on your repository return value)
    if (!response) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Consider running these in a transaction if your repository/database supports it
    await userRepository.invalidateUserBookings(userId);
    const response = await userRepository.deleteUser(userId);

    if (!response) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
