import jwt from 'jsonwebtoken';

function signToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export { signToken, verifyToken };
