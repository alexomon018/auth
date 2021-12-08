import React from "react";
import { Link } from "react-router-dom";
const Movie = ({ movie }) => {
  return (
    <Link className="card" to={`/movies/${movie.id}`}>
      <div className="card-inner">
        <div className="card-front">
          <img src={movie.image} alt={movie.name} />
        </div>
        <div className="card-back">
          <h1>{movie.name}</h1>
          <ul>
            <li>
              <strong>Movie Name:</strong> {movie.name}
            </li>
            <li>
              <strong>Description:</strong> {movie.description}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default Movie;
