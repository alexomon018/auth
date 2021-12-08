import express from "express";
import { getMovieById, getMovies } from "../controllers/moviesController.js";
import { requireUser } from "../middleware/requireUser.js";
const router = express.Router();

router.get("/", requireUser, getMovies).get("/:id", requireUser, getMovieById);

export default router;
