import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
const Home = () => {
  const { userData, handleLogout } = useGlobalContext();

  return (
    <>
      {!userData ? (
        <div>
          {"This is the home page"}
          <Link to="/login">{"Click here to login"}</Link>
        </div>
      ) : (
        <div>
          {"You are logged in and back on home page as:"} {userData.username}{" "}
          {userData.username}
          <Link to="/" onClick={handleLogout}>
            {"Click here to go to logout"}
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
