import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwtUtils';

// 扩展 Request 类型以包含用户信息
declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = JwtUtils.verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}; 