import authRoutes from "./authenticationRoutes.js";
import venueRoutes from "./venueRoutes.js";
import bookingRoutes from "./bookingRoutes.js";

import express from "express"


const mainRouter = express.Router();

mainRouter.use(authRoutes);
mainRouter.use(venueRoutes);
mainRouter.use(bookingRoutes);

export default mainRouter;