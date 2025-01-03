import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  [key: string]: any;
}

export class JwtUtils {
  private static readonly SECRET = process.env.JWT_SECRET || 'fallback_secret';
  private static readonly EXPIRES_IN = '1d';

  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN
    });
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
} 