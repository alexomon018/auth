import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useGlobalContext } from "../../context";
const Home = () => {
  const { loginData, setLoginData, setLogoutData } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/auth`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginData(null);
        setLogoutData(res.data);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/");
      })
      .catch((error) => setLogoutData(error.message));
  };

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
