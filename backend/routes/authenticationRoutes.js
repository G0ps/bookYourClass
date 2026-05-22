import express from "express";

import { login, register } from "../controllers/authenticationController.js";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";
import jwtAutoLoginAttempt from "../middlewares/jwtAutoLoginAttempt.js";

const authRoutes = express.Router();

authRoutes.post("/register", autherizationMiddleware("admin") , register);
authRoutes.post(
  "/login",
  jwtAutoLoginAttempt,
  login
);

export default authRoutes;