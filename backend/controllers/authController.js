import asyncHandler from "express-async-handler";
import {
  authenticateJWTForgotPass,
  authenticateJWTRefresh,
} from "../middleware/authenticateJWTs.js";
import jwt_decode from "jwt-decode";
import {
  generateToken,
  generateRefreshToken,
  generateForgotPasswordToken,
} from "../middleware/generateTokens.js";
import { pool } from "../DBs/postgresConnect.js";

let refreshTokens = [];

//@desc Auth user & get token
//@route POST /auth/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  try {
    if (user.rows.length === 0 || user.rows[0].password !== password) {
      return res.status(401).json({ msg: "Password or username is incorrect" });
    }
    const accessToken = generateToken(
      {
        username: user.rows[0].username,
        name: user.rows[0].name,
      },
      "15s"
    );
    const refreshToken = generateRefreshToken(
      { username: user.username, name: user.name },
      "30d"
    );

    refreshTokens.push(refreshToken);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

//@desc POST to refresh token
//@route POST /auth/refresh
//@access Public
const refreshUser = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send("No token provided please login again");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).send("Invalid operation user is looged out");
    }
    const payload = authenticateJWTRefresh(refreshToken);

    const accessToken = generateToken(payload.payload.payload, "1m");

    res.send({ accessToken: accessToken });
  } catch (error) {
    next(error);
  }
});

//@desc Logout user
//@route DELETE /auth
//@access Public
const logoutHandler = asyncHandler(async (req, res) => {
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.refreshToken
  );
  res.send("Logged out");
});

//@desc Post forgot-password
//@route Post /auth/forgot-password
//@access Public
const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (username !== user.rows[0].username) {
    return res.json("User not found");
  }

  const payload = {
    username: user.rows[0].username,
    id: user.rows[0].user_id,
  };

  const secret = `superhashedsecret${user.rows[0].password}`;

  const token = generateForgotPasswordToken(payload, secret, "15s");

  const link = `http://localhost:3001/reset-password/${token}/`;

  res.send(link);
});

//@desc Get reset-password
//@route Get /auth/reset-password
//@access Public
const getResetPasswordHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const decoded = jwt_decode(token);

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    +decoded.payload.id,
  ]);

  if (!user.rows[0]) {
    return res.send("Invalid id");
  }
  const secret = `superhashedsecret${user.rows[0].password}`;
  try {
    const payload = authenticateJWTForgotPass(token, secret);
    res.send(payload);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

//@desc Post reset-password
//@route Post /auth/reset-password
//@access Public
const resetPassHandler = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  const decoded = jwt_decode(token);

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    +decoded.payload.id,
  ]);

  if (!user.rows[0]) {
    return res.send("Invalid id");
  }
  const secret = `superhashedsecret${user.rows[0].password}`;

  try {
    const payload = authenticateJWTForgotPass(token, secret);

    const user = await pool.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",
      [password, +decoded.payload.id]
    );

    return res.send("Password changed");
  } catch (error) {
    console.log("error", error);
    res.send(error.message);
  }
});

export {
  authUser,
  logoutHandler,
  refreshUser,
  forgotPasswordHandler,
  getResetPasswordHandler,
  resetPassHandler,
};
