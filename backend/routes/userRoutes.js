import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import {
  getUsers,
  patchUser,
  deleteUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get(
  "/",
  authenticationMiddleware,
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  getUsers
);

userRoutes.patch(
  "/",
  authenticationMiddleware,
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  patchUser
);

userRoutes.delete(
  "/",
  authenticationMiddleware,
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  deleteUser
);

export default userRoutes;