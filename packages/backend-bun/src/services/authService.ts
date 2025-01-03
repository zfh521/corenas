import bcrypt from 'bcryptjs';
import type { User, UserInput, LoginInput } from '../types/index';
import UserModel from '../models/User';
import { JwtUtils } from '../utils/jwtUtils';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async register(userData: UserInput): Promise<{ user: User; token: string }> {
    const existingUser = await UserModel.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword
    });

    const token = JwtUtils.generateToken({ id: user.id });
    return { user, token };
  }

  static async login(credentials: LoginInput): Promise<{ user: User; token: string }> {
    const user = await UserModel.findOne({ where: { email: credentials.email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = JwtUtils.generateToken({ id: user.id });
    return { user, token };
  }
} 