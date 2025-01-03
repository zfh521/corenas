import bcrypt from 'bcryptjs';
import { AuthProvider, AuthResult } from '../../interfaces/auth';
import { User } from '../../models/User';
import { JwtUtils } from '../../utils/jwtUtils';
import { ValidationError } from '../../types/error';

export class DbAuthProvider implements AuthProvider {
    getType(): string {
        return 'db';
    }
  async login(credentials: { username: string; password: string }): Promise<AuthResult> {
    const user = await User.findOne({ 
      where: { 
        username: credentials.username 
      } 
    });

    if (!user || !await bcrypt.compare(credentials.password, user.password)) {
      throw new ValidationError('Invalid credentials');
    }

    const token = JwtUtils.generateToken({ id: user.id });
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  async register(userData: { username: string; email: string; password: string }): Promise<AuthResult> {
    const existingUser = await User.findOne({ 
      where: { 
        email: userData.email 
      } 
    });

    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });

    const token = JwtUtils.generateToken({ id: user.id });
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  async verify(token: string): Promise<boolean> {
    try {
      const decoded = JwtUtils.verifyToken(token);
      const user = await User.findByPk(decoded.id);
      return !!user;
    } catch {
      return false;
    }
  }
} 