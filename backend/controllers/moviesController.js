import asyncHandler from "express-async-handler";
import { movies } from "../data/movies.js";
//@desc Get all movies
//@route Get /movies
//@access Public
const getMovies = asyncHandler(async (req, res) => {
  res.status(200).json({
    data: movies,
  });
});

//@desc Get single movie
//@route Get /movies/:id
//@access Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = movies.find((movie) => movie.id === +req.params.id);
  if (!movie) {
    return res.status(404).json({
      success: false,
      error: "No movie found",
    });
  }
  res.status(200).json({
    data: movie,
  });
});

export { getMovies, getMovieById };
