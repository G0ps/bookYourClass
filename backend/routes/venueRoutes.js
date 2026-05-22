import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
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
  "/venue/add",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  addVenue
);

venueRoutes.delete(
  "/venue/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  deleteVenue
);

venueRoutes.put(
  "/venue/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  putVenue
);

venueRoutes.patch(
  "/venue/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  patchVenue
);

// get venues
venueRoutes.get(
  "/venue",
  authenticationMiddleware,
  getVenues
);

export default venueRoutes;