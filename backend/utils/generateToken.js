import jwt from 'jsonwebtoken';

/**
 * Generate JWT token and optionally set HTTP-only cookie
 * @param {string} userId
 * @param {string} role
 * @param {object} res - Optional Express response object
 * @returns {string} token
 */
export const generateToken = (userId, role = 'customer', res = null) => {
  const secret = process.env.JWT_SECRET || 'novara_super_secret_jwt_key_atelier_2025_luxury_platform';
  const token = jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  if (res) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  return token;
};

export default generateToken;
