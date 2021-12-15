import { authenticateJWT } from "./authenticateJWTs.js";
function desirilazeUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }

  const { payload, expired } = authenticateJWT(accessToken);

  if (expired) {
    return res.send("Token expired");
  }

  //validate the token
  if (payload && !expired) {
    req.user = payload;
    return next();
  }

  return next();
}

export default desirilazeUser;
