import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shopsphere_secret_jwt_key_fallback', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};
