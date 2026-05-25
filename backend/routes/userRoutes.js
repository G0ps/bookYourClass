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
  "/:userId",
  autherizationMiddleware(
    "admin"
  ),
  patchUser
);

userRoutes.delete(
  "/:userId",
  autherizationMiddleware(
    "admin"
  ),
  deleteUser
);

export default userRoutes;