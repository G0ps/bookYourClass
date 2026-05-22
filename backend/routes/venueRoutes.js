import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

const venueRoutes = express.Router();

// manage venue
venueRoutes.post("/venue/add",authenticationMiddleware , autherizationMiddleware("student") , (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.delete("/venue/:id", (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.put("/venue/:id", (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.patch("/venue/:id", (req, res) => {
  return res.json({ message: "placeholder" });
});

//get venue
venueRoutes.get('/venue',(req , res) => {
  return res.json({ message: "placeholder" });
});



export default venueRoutes;