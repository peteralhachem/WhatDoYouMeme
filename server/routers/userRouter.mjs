import express from "express";
const router = express.Router();

import {
  login,
  logout,
  getCurrentSession,
  getUserHistory,
} from "../controllers/userController.mjs";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  return next();
};

router.get("/sessions/current", getCurrentSession);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/history/:userId", isLoggedIn, getUserHistory);

export default router;
