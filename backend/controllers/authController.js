import asyncHandler from "express-async-handler";
import {
  authenticateJWTForgotPass,
  authenticateJWTRefresh,
} from "../middleware/authenticateJWTs.js";
import { users } from "../data/users.js";
import {
  generateToken,
  generateRefreshToken,
  generateForgotPasswordToken,
} from "../middleware/generateTokens.js";

let refreshTokens = [];

//@desc Auth user & get token
//@route POST /auth/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please enter all fields");
  }
  const user = users.find((user) => user.username === username);
  try {
    if (user) {
      const accessToken = generateToken(
        {
          username: user.username,
          name: user.name,
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
    } else {
      res.send("Username or password incorrect");
    }
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

  const user = users.find((user) => user.username === username) || "no user";

  if (username !== user.username) {
    return res.json("User not found");
  }

  const payload = {
    username: user.username,
    id: user.id,
  };

  const secret = `superhashedsecret${user.password}`;

  const token = generateForgotPasswordToken(payload, secret, "15s");

  const link = `http://localhost:3001/reset-password/${token}/${user.id}`;

  res.send(link);
});

//@desc Get reset-password
//@route Get /auth/reset-password/:id/:token
//@access Public
const getResetPasswordHandler = asyncHandler(async (req, res) => {
  const { id, token } = req.params;

  const user = users.find((user) => user.id === +id);

  if (!user) {
    return res.send("Invalid id");
  }
  const secret = `superhashedsecret${user.password}`;
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
  const { password, id, token } = req.body;

  const user = users.find((user) => user.id === +id);

  if (!user) {
    return res.send("Invalid id");
  }
  const secret = `superhashedsecret${user.password}`;

  try {
    const payload = authenticateJWTForgotPass(token, secret);

    if (password !== password) {
      return res.send("Passwords do not match");
    }
    user.password = password;

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
