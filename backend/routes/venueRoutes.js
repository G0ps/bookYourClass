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
  "/:id",
  autherizationMiddleware("admin"),
  deleteVenue
);

venueRoutes.put(
  "/:id",
  autherizationMiddleware("admin"),
  putVenue
);

venueRoutes.patch(
  "/:id",
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