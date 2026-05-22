import express from "express";

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
  autherizationMiddleware("staff", "admin"),
  addVenue
);

venueRoutes.delete(
  "/:id",
  autherizationMiddleware("staff", "admin"),
  deleteVenue
);

venueRoutes.put(
  "/:id",
  autherizationMiddleware("staff", "admin"),
  putVenue
);

venueRoutes.patch(
  "/:id",
  autherizationMiddleware("staff", "admin"),
  patchVenue
);

// get venues // pagination
venueRoutes.get(
  "/",
  (req , res) => {return res.json({status : "placeholder needing pagination"})}
);

export default venueRoutes;