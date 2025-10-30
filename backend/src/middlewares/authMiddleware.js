import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/userModel.js';

export default async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit: Admin requis' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
}