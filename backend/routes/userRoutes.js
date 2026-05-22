import express from "express";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import {
  getUsers,
  patchUser,
  deleteUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get(
  "/",
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  getUsers
);

userRoutes.patch(
  "/",
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  patchUser
);

userRoutes.delete(
  "/",
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  deleteUser
);

export default userRoutes;