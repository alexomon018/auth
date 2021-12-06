import express from "express";
import {
  authUser,
  getSessionHandler,
  logoutHandler,
} from "../controllers/userController.js";
import { requireUser } from "../middleware/requireUser.js";
const router = express.Router();

router
  .post("/login", authUser)
  .get("/", requireUser, getSessionHandler)
  .delete("/", requireUser, logoutHandler);

export default router;
