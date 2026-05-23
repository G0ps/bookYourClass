import express from "express";

import { login, logout, register } from "../controllers/authenticationController.js";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";
import jwtAutoLoginAttempt from "../middlewares/jwtAutoLoginAttempt.js";

const authRoutes = express.Router();

authRoutes.post("/register", autherizationMiddleware("admin") , register);
authRoutes.post(
  "/login",
  jwtAutoLoginAttempt,
  login
);
authRoutes.post("/logout" , logout)

export default authRoutes;