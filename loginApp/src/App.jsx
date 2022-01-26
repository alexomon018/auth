import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import LoggedDevices from "./components/LoggedDevices/LoggedDevices";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/devices" element={<LoggedDevices />}></Route>

        <Route
          exact
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
        <Route
          exact
          path="/forgot-password"
          element={<ForgotPassword />}
        ></Route>
      </Routes>
    </AppProvider>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("app")
);
