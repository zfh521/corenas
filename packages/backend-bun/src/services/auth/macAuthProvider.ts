import { AuthProvider, AuthResult } from '../../interfaces/auth';
import { User } from '../../models/User';
import { JwtUtils } from '../../utils/jwtUtils';
import { ValidationError } from '../../types/error';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class MacAuthProvider implements AuthProvider {
    getType(): string {
        return 'mac';
    }
  async login(credentials: { username: string; password: string }): Promise<AuthResult> {
    try {
      // 使用 dscl 验证用户是否存在
      const { stdout } = await execAsync(`dscl . -read /Users/${credentials.username}`);
      if (!stdout) {
        throw new ValidationError('User not found');
      }

      // 注意：macOS 不提供直接的密码验证 API
      // 这里我们只验证用户存在性，实际使用时应该使用其他认证方式
      
      let [user] = await User.findOrCreate({
        where: { username: credentials.username },
        defaults: {
          username: credentials.username,
          email: `${credentials.username}@system`,
          password: 'MAC_AUTH'
        }
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
    } catch (error) {
      throw new ValidationError('Invalid credentials');
    }
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