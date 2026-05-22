import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

import {
  addVenue,
  deleteVenue,
  putVenue,
  patchVenue,
} from "../controllers/venueController.js";

const venueRoutes = express.Router();

// manage venue
venueRoutes.post(
  "/add",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  addVenue
);

venueRoutes.delete(
  "/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  deleteVenue
);

venueRoutes.put(
  "/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  putVenue
);

venueRoutes.patch(
  "/:id",
  authenticationMiddleware,
  autherizationMiddleware("staff", "admin"),
  patchVenue
);

// get venues // pagination
venueRoutes.get(
  "/",
  authenticationMiddleware,
  (req , res) => {return res.json({status : "placeholder needing pagination"})}
);

export default venueRoutes;