import asyncHandler from "express-async-handler";
import { createSession, invalidateSession, users } from "../data/users.js";
import {
  generateToken,
  generateRefreshToken,
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

export { authUser, logoutHandler, getSessionHandler };
