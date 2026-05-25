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
    "admin"
  ),
  getUsers
);

userRoutes.patch(
  "/",
  autherizationMiddleware(
    "admin"
  ),
  patchUser
);

userRoutes.delete(
  "/",
  autherizationMiddleware(
    "admin"
  ),
  deleteUser
);

export default userRoutes;