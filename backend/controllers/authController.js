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
import UserLog from "../models/logModel.js";
import { pool } from "../DBs/postgresConnect.js";
import { JWTManager } from "../middleware/revokeJWTs.js";
import uniqid from "uniqid";

let refreshTokens = [];

//@desc Auth user & get token
//@route POST /auth/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  let tokenId = uniqid();

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  try {
    if (user.rows.length === 0 || user.rows[0].password !== password) {
      return res.status(401).json({ msg: "Password or username is incorrect" });
    }
    const accessToken = generateToken(
      {
        token_id: tokenId,
        id: user.rows[0].user_id,
        username: user.rows[0].username,
        name: user.rows[0].name,
        device: `${req.useragent.browser} ${req.useragent.os} ${req.useragent.platform}`,
      },
      "15s"
    );
    const refreshToken = generateRefreshToken(
      {
        token_id: tokenId,
        id: user.rows[0].user_id,
        username: user.rows[0].username,
        name: user.rows[0].name,
        device: `${req.useragent.browser} ${req.useragent.os} ${req.useragent.platform}`,
      },
      "30d"
    );

    const log = await UserLog.findOne({ username: user.rows[0].username });

    if (
      log &&
      log.device ===
        `${req.useragent.browser} ${req.useragent.os} ${req.useragent.platform}`
    ) {
      await UserLog.updateOne(
        { username: user.rows[0].username },
        {
          $set: {
            lastLogin: Date.now(),
            device: `${req.useragent.browser} ${req.useragent.os} ${req.useragent.platform}`,
          },
        }
      );
    } else {
      await UserLog.create({
        username: user.rows[0].username,
        user_id: user.rows[0].user_id,
        lastLogin: Date.now(),
        token_id: tokenId,
        device: `${req.useragent.browser} ${req.useragent.os} ${req.useragent.platform}`,
      });
    }

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
const refreshUser = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send("No token provided please login again");
    }

    const payload = authenticateJWTRefresh(refreshToken);
    if (payload.revoked) {
      return res.send("Not vaild");
    } else {
      const accessToken = generateToken(payload.payload.payload, "15s");
      res.send({ accessToken: accessToken });
    }
  } catch (error) {
    next(error);
  }
});

//@desc POST to withdraw
//@route POST /auth/withdraw
//@access Public
const withdrawUser = asyncHandler(async (req, res) => {
  try {
    const { deviceId } = req.body;
    const log = await UserLog.findOne({ _id: deviceId });

    const duration = 2.592e6;
    JWTManager.revoke(log.token_id, duration);

    await UserLog.deleteOne({ token_id: log.token_id });

    res.send("User withdrawned out");
  } catch (error) {
    console.log(error);
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

//@desc Handle user devices
//@route GET /auth/devices
//@access Public
const userDevicesHandler = asyncHandler(async (req, res) => {
  const { payload } = req.user;

  const logins = [];

  try {
    const logs = await UserLog.find({ username: payload.username });

    logs.forEach((log) => {
      logins.push({
        device: log.device,
        lastLogin: log.lastLogin,
        id: log._id,
        user_id: log.user_id,
      });
    });

    res.json({
      logins,
    });
  } catch (error) {
    console.log(error);
  }
});

//@desc Post forgot-password
//@route Post /auth/forgot-password
//@access Public
const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { username } = req.body;

  try {
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
  } catch (error) {
    console.log(error);
  }
});
//@desc Get reset-password
//@route Get /auth/reset-password
//@access Public
const getResetPasswordHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt_decode(token);

    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      +decoded.payload.id,
    ]);

    if (!user.rows[0]) {
      return res.send("Invalid id");
    }
    const secret = `superhashedsecret${user.rows[0].password}`;

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

  try {
    const decoded = jwt_decode(token);

    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      +decoded.payload.id,
    ]);

    if (!user.rows[0]) {
      return res.send("Invalid id");
    }
    const secret = `superhashedsecret${user.rows[0].password}`;

    const payload = authenticateJWTForgotPass(token, secret);

    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      password,
      +decoded.payload.id,
    ]);

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
  withdrawUser,
  userDevicesHandler,
  forgotPasswordHandler,
  getResetPasswordHandler,
  resetPassHandler,
};
