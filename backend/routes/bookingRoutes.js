import express from "express";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import { requestVenue , patchBooking, getAllBookingsByEmail } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/" , autherizationMiddleware("admin" , "staff") , requestVenue);
bookingRoutes.patch(
  "/:bookingId",
  autherizationMiddleware(
    "admin",
    "staff"
  ),
  patchBooking
);

bookingRoutes.get("/" , autherizationMiddleware("admin" , "staff") , getAllBookingsByEmail)


export default bookingRoutes;