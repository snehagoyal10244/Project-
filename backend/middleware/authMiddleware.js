import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - verifies JWT from Authorization Bearer header or cookie
 */
export const protect = async (req, res, next) => {
  let token;

  // Check Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    // Check cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'novara_super_secret_jwt_key_atelier_2025_luxury_platform';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed or expired.',
    });
  }
};

/**
 * Optional authentication - attaches req.user if valid token provided, but doesn't block
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'novara_super_secret_jwt_key_atelier_2025_luxury_platform';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore error for optional auth
    }
  }

  next();
};
