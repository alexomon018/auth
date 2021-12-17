import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
const AppContext = React.createContext();

const initalState = null;

const AppProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(initalState);
  const [logoutData, setLogoutData] = useState({ success: false });

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_REFRESH_TOKEN_URL}`,
        {
          refreshToken: Cookies.get("refreshToken"),
        }
      );
      Cookies.set("accessToken", response.data.accessToken);
      const decodedToken = jwt_decode(Cookies.get("accessToken"));
      setLoginData(decodedToken.payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create({
    headers: {
      Authorization: `JWT ${Cookies.get("accessToken")}`,
    },
  });

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(Cookies.get("accessToken"));
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = `JWT ${data.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      const decoded = jwt_decode(Cookies.get("accessToken"));
      setLoginData(decoded.payload);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        loginData,
        logoutData,
        setLoginData,
        setLogoutData,
        axiosJWT,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
