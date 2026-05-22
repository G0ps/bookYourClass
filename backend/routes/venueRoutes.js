import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

const venueRoutes = express.Router();

// manage venue
venueRoutes.post("/venue/add",authenticationMiddleware , autherizationMiddleware("staff" , "admin") , (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.delete("/venue/:id",authenticationMiddleware , autherizationMiddleware("staff" , "admin") , (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.put("/venue/:id",authenticationMiddleware , autherizationMiddleware("staff" , "admin") , (req, res) => {
  return res.json({ message: "placeholder" });
});
venueRoutes.patch("/venue/:id",authenticationMiddleware , autherizationMiddleware("staff" , "admin") , (req, res) => {
  return res.json({ message: "placeholder" });
});

//get venue
venueRoutes.get('/venue',authenticationMiddleware ,(req , res) => {
  return res.json({ message: "placeholder" });
});



export default venueRoutes;