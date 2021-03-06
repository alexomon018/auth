import React, { useState, useEffect } from "react";
import Movie from "./Movie";
import { useGlobalContext } from "loginApp/context";
import { Link } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  const { userData, axiosJWT } = useGlobalContext();

  useEffect(() => {
    const fetchMovies = async () => {
      axiosJWT
        .get(`${process.env.REACT_APP_BASE_URL}/movies`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.msg) {
            setMovies(res.data.msg);
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
      {userData ? (
        movies?.map((movie) => <Movie key={movie.id} movie={movie}></Movie>)
      ) : (
        <div>
          {"You have to be logged in."}
          <Link to="/login">Log in</Link>
        </div>
      )}
    </section>
  );
};

export default Movies;
