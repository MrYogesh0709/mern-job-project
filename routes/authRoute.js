import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/authController.js";
import authenticatedUser from "../middleware/auth.js";
const router = express.Router();

import rateLimiter from "express-rate-limit";
import testUser from "../middleware/testUser.js";
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/logout").get(logout);
router.route("/updateUser").patch(authenticatedUser, testUser, updateUser);
router.route("/getCurrentUser").get(authenticatedUser, getCurrentUser);

export default router;
