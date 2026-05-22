import express from "express";

import authenticationMiddleware from "../middlewares/jwtAuthenticationMiddleware.js";
import autherizationMiddleware from "../middlewares/autherizationMiddleware.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/request/venue" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req, res) => {
  return res.json({ message: "placeholder" });
});
bookingRoutes.patch("/request" ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req , res) => {
  return res.json({ message: "placeholder" });
});
bookingRoutes.post("/request/cancel",authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req, res) => {
  return res.json({ message: "placeholder" });
});

bookingRoutes.post("/request/approve",authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req, res) => {
  return res.json({ message: "placeholder" });
});
bookingRoutes.post("/request/reject",authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req, res) => {
  return res.json({ message: "placeholder" });
});

// get booking by ID
bookingRoutes.get('/booking' ,authenticationMiddleware , autherizationMiddleware("admin" , "staff") , (req, res) => {
  return res.json({ message: "placeholder" });
});


export default bookingRoutes;