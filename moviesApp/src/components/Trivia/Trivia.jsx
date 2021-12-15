import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const Trivia = () => {
  const [movie, setMovie] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const fetchSingleMovie = async () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/movies/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.msg) {
            set;
          }
          setMovie(res.data.data);
        })
        .catch((error) => {
          setMovie(error.message);
        });
    };

    fetchSingleMovie();
  }, []);

  return (
    <div>
      <h1>Trivia</h1>
      <div>{movie.longDescription}</div>
    </div>
  );
};

export default Trivia;
