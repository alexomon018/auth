import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../context";
const Home = () => {
  const { loginData, setLoginData, logoutData, setLogoutData } =
    useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    axios
      .delete(`http://localhost:8080/users`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginData(null);
        setLogoutData(res.data);
        navigate("/");
      })
      .catch((error) => setLogoutData(error.message));
  };

  console.log(logoutData);

  return (
    <>
      {!loginData ? (
        <div>
          This is the home page <Link to="/login">Click here to login</Link>
        </div>
      ) : (
        <div>
          {" "}
          You are logged in and back on home page as {loginData.username}{" "}
          <Link to="/" onClick={handleLogout}>
            Click here to go to logout
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
