import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import { requestVenue , patchBooking } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/booking" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , requestVenue);
bookingRoutes.patch("/booking" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , patchBooking);

// get booking by ID // pagination handling
bookingRoutes.get('/booking' ,authenticationMiddleware , autherizationMiddleware("admin") , (req, res) => {
  return res.json({ message: "placeholder" });
});

export default bookingRoutes;