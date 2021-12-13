import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPassword />}
          ></Route>
          <Route
            exact
            path="/reset-password/:token/:id"
            element={<ResetPassword />}
          ></Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
