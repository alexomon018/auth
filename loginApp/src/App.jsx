import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
