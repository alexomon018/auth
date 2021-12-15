import express from "express";
import {
  authUser,
  refreshUser,
  logoutHandler,
  forgotPasswordHandler,
  getResetPasswordHandler,
  resetPassHandler,
} from "../controllers/authController.js";
const router = express.Router();

router
  .post("/login", authUser)
  .post("/refresh", refreshUser)
  .post("/forgot-password", forgotPasswordHandler)
  .get("/reset-password/:id/:token", getResetPasswordHandler)
  .post("/reset-password", resetPassHandler)
  .delete("/", logoutHandler);

export default router;
