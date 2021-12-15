import express from "express";
import { getMovieById, getMovies } from "../controllers/moviesController.js";
import desirilazeUser from "../middleware/desirilazeUser.js";
const router = express.Router();

router
  .get("/", desirilazeUser, getMovies)
  .get("/:id", desirilazeUser, getMovieById);

export default router;
