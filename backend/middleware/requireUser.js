export function requireUser(req, res, next) {
  if (!req.user) {
    return res.json({ msg: "You must be logged in to do that!" });
  }

  return next();
}
