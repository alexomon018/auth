import express from "express";
import {
  authUser,
  getSessionHandler,
  logoutHandler,
  forgotPasswordHandler,
  getResetPasswordHandler,
  resetPassHandler,
} from "../controllers/userController.js";
import { requireUser } from "../middleware/requireUser.js";
const router = express.Router();

router
  .post("/login", authUser)
  .post("/forgot-password", forgotPasswordHandler)
  .get("/reset-password/:id/:token", getResetPasswordHandler)
  .post("/reset-password/:id/:token", resetPassHandler)
  .get("/", requireUser, getSessionHandler)
  .delete("/", requireUser, logoutHandler);

export default router;
