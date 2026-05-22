import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import { requestVenue , patchBooking } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , requestVenue);
bookingRoutes.patch("/" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , patchBooking);


export default bookingRoutes;