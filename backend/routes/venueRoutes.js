import express from "express";

import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import {
  addVenue,
  deleteVenue,
  putVenue,
  patchVenue,
  getVenues,
} from "../controllers/venueController.js";

const venueRoutes = express.Router();

// manage venue
venueRoutes.post(
  "/add",
  autherizationMiddleware("admin"),
  addVenue
);

venueRoutes.delete(
  "/:venueId",
  autherizationMiddleware("admin"),
  deleteVenue
);

venueRoutes.put(
  "/:venueId",
  autherizationMiddleware("admin"),
  putVenue
);

venueRoutes.patch(
  "/:venueId",
  autherizationMiddleware("admin"),
  patchVenue
);

// get venues // pagination
venueRoutes.get(
  "/",
  autherizationMiddleware("admin" , "staff"),
  getVenues
);

export default venueRoutes;