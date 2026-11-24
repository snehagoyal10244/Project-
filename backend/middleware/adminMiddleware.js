/**
 * Restrict route to admin users only
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Atelier administrator privilege required.',
    });
  }
};

export default admin;
