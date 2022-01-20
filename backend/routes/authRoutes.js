import express from "express";
import desirilazeUser from "../middleware/desirilazeUser.js";
import {
  authUser,
  refreshUser,
  logoutHandler,
  forgotPasswordHandler,
  getResetPasswordHandler,
  userDevicesHandler,
  resetPassHandler,
  withdrawUser,
} from "../controllers/authController.js";
const router = express.Router();

router
  .post("/login", authUser)
  .post("/refresh", refreshUser)
  .post("/withdraw", withdrawUser)
  .post("/forgot-password", forgotPasswordHandler)
  .get("/reset-password/:token/", getResetPasswordHandler)
  .get("/devices", desirilazeUser, userDevicesHandler)
  .post("/reset-password", resetPassHandler)
  .delete("/", logoutHandler);

export default router;
