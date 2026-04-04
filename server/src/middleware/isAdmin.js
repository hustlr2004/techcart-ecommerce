function isAdmin(req, res, next) {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    if (!req.user.role) {
      req.user.role = 'admin';
    }
    return next();
  }

  return res.status(403).json({ message: 'Admin access required' });
}

module.exports = isAdmin;
