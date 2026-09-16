import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretagritechkey123');
      req.farmerId = decoded.id;
      req.userId = decoded.id;
      req.userRole = decoded.role || 'farmer';
      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `User role '${req.userRole}' is not authorized to access this resource`
      });
    }
    next();
  };
};

export { protect, authorizeRoles };

