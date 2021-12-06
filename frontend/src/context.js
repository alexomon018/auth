import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
const AppContext = React.createContext();

const initalState = null;

const AppProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(initalState);
  const [logoutData, setLogoutData] = useState({ success: false });
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg) {
          setLoginData(null);
        }
        setLoginData(res.data.payload);
      })
      .catch((error) => setSessionData(error.message));
  }, []);

  return (
    <AppContext.Provider
      value={{
        loginData,
        logoutData,
        setLoginData,
        setLogoutData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
