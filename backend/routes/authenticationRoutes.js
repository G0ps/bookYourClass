import express from "express";

import { login, logout, register } from "../controllers/authenticationController.js";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";
import jwtAutoLoginAttempt from "../middlewares/jwtAutoLoginAttempt.js";
import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register" ,authenticationMiddleware , register);
authRoutes.post(
  "/login",
  jwtAutoLoginAttempt,
  login
);
authRoutes.post("/logout" , logout)

export default authRoutes;