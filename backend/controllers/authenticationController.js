import authenticationRepository from "../repositories/authenticationRepository.js"

import jwt_service from "../services/jwt_service.js";

import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const {
        name,
        email,
        contactNumber,
        password,
        typeOfUser,
    } = req.body;

    const missing_fields = [];

    if (!name) missing_fields.push("name");
    if (!email) missing_fields.push("email");
    if (!contactNumber) missing_fields.push("contactNumber");
    if (!password) missing_fields.push("password");
    if (!typeOfUser) missing_fields.push("typeOfUser");

    if (missing_fields.length > 0) {
        return res.status(400).json({
            status: "Error",
            message: "Values missing",
            missing_fields,
        });
    }

    try {
        // ✅ hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await authenticationRepository.insertNewUser({
            name,
            email,
            contactNumber,
            password: hashedPassword, // 👈 store hashed password
            typeOfUser,
        });

        if (response.status === "error") {
            throw response.error;
        }

        return res.status(201).json({ status: "success" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};


export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if(req.isAuthenticated)
    {
        return res.status(200).json({
            status: "success",
            role: req.user.role
        })
    }
    // console.log("req : " , req.user)

    const missing_fields = [];

    if (!email) missing_fields.push("email");
    if (!password) missing_fields.push("password");

    if (missing_fields.length > 0) {
        return res.status(400).json({
            status: "Error",
            message: "Values missing",
            missing_fields,
        });
    }

    try {
        const user = await authenticationRepository.getUserByEmail(email);

        if (!user) {
            throw new Error("user not found");
        }

        // ✅ compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("password mismatched");
        }

        jwt_service.assign_token(res, user);

        return res.status(202).json({
            status: "success",
            role: user.typeOfUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};