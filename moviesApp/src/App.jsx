import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "loginApp/context";
import Movies from "./components/Movies/Movies";
import Trivia from "./components/Trivia/Trivia";
import Login from "loginApp/Login";
import Home from "loginApp/Home";
import ResetPassword from "loginApp/ResetPassword";
import ForgotPassword from "loginApp/ForgotPassword";
import "./index.css";

const App = () => {
  return (
    <AppProvider>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/movies" element={<Movies />}></Route>
          <Route exact path="/movies/:id" element={<Trivia />}></Route>
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPassword />}
          ></Route>
          <Route
            exact
            path="/reset-password/:token"
            element={<ResetPassword />}
          ></Route>
        </Routes>
      </div>
    </AppProvider>
  );
};
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("app")
);
