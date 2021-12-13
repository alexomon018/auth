import asyncHandler from "express-async-handler";
import { createSession, invalidateSession, users } from "../data/users.js";
import { authenticateJWTForgotPass } from "../middleware/authenticateJWTs.js";
import {
  generateToken,
  generateRefreshToken,
  generateForgotPasswordToken,
} from "../middleware/generateTokens.js";

//@desc Auth user & get token
//@route POST /users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please enter all fields");
  }
  const user = users.find((user) => user.username === username);
  try {
    if (user) {
      //refresh token is going to have a reference to the session
      const session = createSession(username, user.name);

      // Generate an access token
      const accessToken = generateToken(
        {
          username: user.username,
          name: user.name,
          sessionId: session.sessionId,
        },
        "15s"
      );
      const refreshToken = generateRefreshToken(
        { sessionId: session.sessionId },
        "7d"
      );

      res.cookie("accessToken", accessToken, {
        maxAge: 300000, // 5 minutes
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 2.628e9, // 1 month
        httpOnly: true,
      });

      return res.status(200).send(session);
    } else {
      res.send("Username or password incorrect");
    }
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

//@desc Get current user loggedIn session
//@route GET /users/login
//@access Public
const getSessionHandler = asyncHandler(async (req, res) => {
  return res.send(req.user);
});

//@desc Logout user
//@route DELETE /users
//@access Public

const logoutHandler = asyncHandler(async (req, res) => {
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  const session = invalidateSession(req.user.payload.sessionId);

  res.send({ success: true });
});

//@desc Post forgot-password
//@route Post /users/forgot-password
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

  const token = generateForgotPasswordToken(payload, secret, "1m");

  const link = `http://localhost:3001/reset-password/${token}/${user.id}`;

  res.send(link);
});

//@desc Get reset-password
//@route Get /users/reset-password/:id/:token
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
//@route Post /users/reset-password
//@access Public
const resetPassHandler = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  const user = users.find((user) => user.id === +id);

  if (!user) {
    return res.send("Invalid id");
  }
  const secret = `superhashedsecret${user.password}`;

  try {
    const payload = authenticateJWTForgotPass(token, secret);

    if (password !== password2) {
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
  getSessionHandler,
  forgotPasswordHandler,
  getResetPasswordHandler,
  resetPassHandler,
};
