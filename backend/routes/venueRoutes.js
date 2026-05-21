import express from "express";

const venueRoutes = express.Router();

venueRoutes.post("/venue/add", (req, res) => {
  res.json({ message: "placeholder" });
});
venueRoutes.delete("/venue/:id", (req, res) => {
  res.json({ message: "placeholder" });
});
venueRoutes.put("/venue/:id", (req, res) => {
  res.json({ message: "placeholder" });
});
venueRoutes.patch("/venue/:id", (req, res) => {
  res.json({ message: "placeholder" });
});

export default venueRoutes;