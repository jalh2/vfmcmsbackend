const protect = (req, res, next) => {
  next();
};

const requireSuperAdmin = (req, res, next) => {
  next();
};

module.exports = { protect, requireSuperAdmin };
