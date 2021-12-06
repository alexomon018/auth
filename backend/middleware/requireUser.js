export function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ msg: "You must be logged in to do that!" });
  }

  return next();
}
