import authRoutes from "./authenticationRoutes.js";
import venueRoutes from "./venueRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import userRoutes from "./userRoutes.js";

import express from "express"


const mainRouter = express.Router();

mainRouter.use("/authentication" , authRoutes);
mainRouter.use("/venue" , venueRoutes);
mainRouter.use("/booking" , bookingRoutes);
mainRouter.use("/user" , userRoutes);

export default mainRouter;