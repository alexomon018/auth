import jwt from "jsonwebtoken";
import { JWTManager } from "./revokeJWTs.js";
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0tv6ptuEJ/l3afd8Zedukagy6
LZNuC7dcUKi6DD6f3Q8jGMpukd/nVLWiQHikIlmS9lSSzCHB9IRqC9h8UI0/fs8y
7oILq58ikMJcs4lAIndH0udqqcDniIc7VdN2sfPlg1zursCKFnj6GsV32+TaH6OI
bAbwfO4UzRAUIW8vtwIDAQAB
-----END PUBLIC KEY-----`;

const publicKeyRefresh = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMjp3rG0zVApcV8ohs/F+63kaw
lM92m7PWx0BQI3jFr3HAfi5aj7RmsQpiHEbubRVGtOqM0xWOcg/v6lY7nOZBEIK3
W+JJNcwJ4vEoCeHtIkyk9u0/Ts5vSNUfR/RVj3EJNWspXJF+3N6Z0cCgIiEHB8g7
NUfVV+TSiXt+A+5Z8QIDAQAB
-----END PUBLIC KEY-----`;

const authenticateJWT = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: error, expired: error.message.includes("jwt expired") };
  }
};
const authenticateJWTRefresh = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, publicKeyRefresh);

    if (!JWTManager.isValid(decoded)) {
      return {
        payload: null,
        revoked: true,
      };
    }

    return { payload: decoded, expired: false };
  } catch (error) {
    return {
      payload: null,
      expired: error.message.includes("jwt expired"),
    };
  }
};
const authenticateJWTForgotPass = (resetPassToken, secret) => {
  try {
    const decoded = jwt.verify(resetPassToken, secret);
    return { payload: decoded, expired: false };
  } catch (error) {
    return {
      payload: null,
      expired: error.message.includes("jwt expired"),
    };
  }
};

export { authenticateJWT, authenticateJWTRefresh, authenticateJWTForgotPass };
