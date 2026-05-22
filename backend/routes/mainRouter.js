import express from "express"

import authRoutes from "./authenticationRoutes.js";
import venueRoutes from "./venueRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import userRoutes from "./userRoutes.js";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";

const mainRouter = express.Router();

mainRouter.use("/authentication" , authRoutes);
mainRouter.use("/venue" ,authenticationMiddleware , venueRoutes);
mainRouter.use("/booking" , authenticationMiddleware ,bookingRoutes);
mainRouter.use("/user" , authenticationMiddleware , userRoutes);

export default mainRouter;