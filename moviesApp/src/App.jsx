import React from "react";
import ReactDOM from "react-dom";
import Movies from "./components/Movies/Movies";
import Trivia from "./components/Trivia/Trivia";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "loginApp/Login";
import Home from "loginApp/Home";
import { AppProvider } from "loginApp/context";
import "./index.css";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/movies" element={<Movies />}></Route>
            <Route exact path="/movies/:id" element={<Trivia />}></Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
