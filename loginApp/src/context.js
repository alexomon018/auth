import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const AppContext = React.createContext();

const initalState = null;

const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(initalState);
  const [accessToken, setAccessToken] = useState(
    () => Cookies.get("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => Cookies.get("refreshToken") || null
  );
  const [devices, setDevices] = useState([]);
  let [loading, setLoading] = useState(true);

  const [withdrawMessage, setWithdrawMessage] = useState(null);

  const navigate = useNavigate();

  const axiosJWT = axios.create({
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });

  axiosJWT.interceptors.request.use(async (req) => {
    const user = jwt_decode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_REFRESH_TOKEN_URL}`,
      {
        refreshToken: refreshToken,
      }
    );
    if (response.data === "Not vaild") {
      Cookies.remove("accessToken");
      setUserData(null);
    } else {
      Cookies.set("accessToken", response.data.accessToken);

      setAccessToken(response.data.accessToken);

      setUserData(jwt_decode(response.data.accessToken).payload);

      req.headers.Authorization = `JWT ${response.data.accessToken}`;
    }

    return req;
  });

  const handleLogin = async (username, password) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_LOGIN_URL}`,
        { username, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUserData(jwt_decode(accessToken).payload);
        navigate("/movies");
      })
      .catch((error) => console.log(error.message));
  };
  const handleLogout = async () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/auth`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(null);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/login");
      })
      .catch((error) => console.log(error.message));
  };
  const handleWithdraw = async (deviceId) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_WITHDRAW_TOKEN_URL}`,
        {
          deviceId: deviceId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setWithdrawMessage(res.data);
      })
      .catch((error) => console.log(error.message));
  };
  const handleDevices = async () => {
    axiosJWT
      .get(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_DEVICES_URL}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setDevices(res.data.logins);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (accessToken && refreshToken) {
      setUserData(jwt_decode(accessToken).payload);
    } else {
      setUserData(null);
    }
    setLoading(false);
  }, [accessToken, refreshToken, loading]);

  return (
    <AppContext.Provider
      value={{
        userData,
        withdrawMessage,
        devices,
        axiosJWT,
        handleLogin,
        handleLogout,
        handleWithdraw,
        handleDevices,
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
