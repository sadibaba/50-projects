import { verify } from 'jsonwebtoken';
export default (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });
  try {
    const decoded = verify(token, 'secretKey');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token invalid' });
  }
};