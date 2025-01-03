import { AuthProvider, AuthResult } from '../../interfaces/auth';
import { User } from '../../models/User';
import { JwtUtils } from '../../utils/jwtUtils';
import { ValidationError } from '../../types/error';

// 动态导入 PAM，仅在 Linux 上尝试
let pamAuthenticatePromise: any;
if (process.platform === 'linux') {
  import('node-linux-pam').then(module => {
    pamAuthenticatePromise = module.pamAuthenticatePromise;
  });
}

export class PamAuthProvider implements AuthProvider {
  getType(): string {
    return 'pam';
  }
  private pamService: string;

  constructor(pamService: string = 'system-auth') {
    this.pamService = pamService;
    if (process.platform !== 'linux') {
      console.warn('PAM authentication is only available on Linux systems');
    }
  }

  async login(credentials: { username: string; password: string }): Promise<AuthResult> {
    if (process.platform !== 'linux') {
      throw new ValidationError('PAM authentication is not available on this platform');
    }

    try {
      await pamAuthenticatePromise({
        serviceName: this.pamService,
        username: credentials.username,
        password: credentials.password
      });
      
      // 查找或创建用户记录
      let [user] = await User.findOrCreate({
        where: { username: credentials.username },
        defaults: {
          username: credentials.username,
          email: `${credentials.username}@system`,
          password: 'PAM_AUTH' // 不存储实际密码
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