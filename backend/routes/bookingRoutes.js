import express from "express";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import { requestVenue , patchBooking, getAllBookingsOfStaff , getAllBookingsForAdmin , cancelBooking } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/" , autherizationMiddleware("admin" , "staff") , requestVenue);
bookingRoutes.patch(
  "/:bookingId",
  autherizationMiddleware(
    "admin"
  ),
  patchBooking
);
bookingRoutes.patch(
  "/cancel/:bookingId",
  autherizationMiddleware(
    "staff"
  ),
  cancelBooking
);

bookingRoutes.get("/" , autherizationMiddleware("admin" , "staff") , getAllBookingsOfStaff)
bookingRoutes.get("/admin" , autherizationMiddleware("admin" ) , getAllBookingsForAdmin)


export default bookingRoutes;