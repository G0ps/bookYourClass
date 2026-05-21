import express from "express";

const bookingRoutes = express.Router();

bookingRoutes.post("/request/venue", (req, res) => {
  return res.json({ message: "placeholder" });
});
bookingRoutes.post("/request/cancel", (req, res) => {
  return res.json({ message: "placeholder" });
});

bookingRoutes.post("/request/approve", (req, res) => {
  return res.json({ message: "placeholder" });
});
bookingRoutes.post("/request/reject", (req, res) => {
  return res.json({ message: "placeholder" });
});

// get booking by ID
bookingRoutes.get('/booking' , (req, res) => {
  return res.json({ message: "placeholder" });
});


export default bookingRoutes;