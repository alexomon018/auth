import React, { useState, useEffect } from "react";
import Movie from "./Movie";
import axios from "axios";
import { useGlobalContext } from "loginApp/context";
import { Link } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  const { loginData } = useGlobalContext();

  useEffect(() => {
    const fetchMovies = async () => {
      axios
        .get(`http://localhost:8080/movies`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.msg) {
            set;
          }
          setMovies(res.data.data);
        })
        .catch((error) => {
          setMovies(error.message);
        });
    };

    fetchMovies();
  }, []);

  return (
    <section className="cards">
      {loginData ? (
        movies?.map((movie) => <Movie key={movie.id} movie={movie}></Movie>)
      ) : (
        <div>
          You have to be logged in to see the movies{" "}
          <Link to="/login">Log in</Link>
        </div>
      )}
    </section>
  );
};

export default Movies;
