import express from "express";

const authRoutes = express.Router();

authRoutes.post("/register", (req, res) => {
  return res.json({ message: "placeholder" });
});
authRoutes.post("/login", (req, res) => {
  return res.json({ message: "placeholder" });
});

export default authRoutes;