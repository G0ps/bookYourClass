import express from "express";

import { login, register } from "../controllers/authenticationController.js";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";


const authRoutes = express.Router();

authRoutes.post("/register", autherizationMiddleware("admin") , register);
authRoutes.post("/login", login);

export default authRoutes;