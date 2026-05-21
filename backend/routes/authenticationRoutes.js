import express from "express";

import { register } from "../controllers/authenticationController.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", (req, res) => {
  return res.json({ message: "placeholder" });
});

export default authRoutes;