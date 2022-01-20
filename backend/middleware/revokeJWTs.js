const JWTManager = {
  revokedJWTs: {},

  isValid: function (jwt) {
    const expiration = JWTManager.revokedJWTs[jwt.payload.token_id];
    return (
      typeof expiration === "undefined" ||
      expiration === null ||
      expiration < jwt.exp * 1000
    );
  },

  revoke: function (userId, durationSeconds) {
    JWTManager.revokedJWTs[userId] = Date.now() + durationSeconds * 1000;
    //everything after this is okay everything before this is bad
  },

  _cleanUp: function () {
    const now = Date.now();
    Object.keys(JWTManager.revokedJWTs).forEach((item, index, _array) => {
      const expiration = JWTManager.revokedJWTs[item];
      if (expiration < now) {
        delete JWTManager.revokedJWTs[item];
      }
    });
  },
};

setInterval(JWTManager._cleanUp, 7000).unref();

export { JWTManager };
