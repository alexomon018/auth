import { getSession } from "../data/users.js";
import { authenticateJWT, authenticateJWTRefresh } from "./authenticateJWTs.js";
import { generateToken } from "./generateTokens.js";
function desirilazeUser(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = authenticateJWT(accessToken);

  //validate the token
  if (payload && !expired) {
    req.user = payload;
    return next();
  }

  //expired but valid access token

  const { payload: refresh } =
    expired && refreshToken
      ? authenticateJWTRefresh(refreshToken)
      : { payload: null };

  if (!refresh) {
    return next();
  }
  const session = getSession(refresh.payload.sessionId);

  if (!session) {
    return next();
  }

  const newAccessToken = generateToken(session, "15s");

  res.cookie("accessToken", newAccessToken, {
    maxAge: 300000,
    httpOnly: true,
  });

  req.user = authenticateJWT(newAccessToken).payload;

  return next();
}

export default desirilazeUser;
