import { AuthProvider } from '../../interfaces/auth';
import { DbAuthProvider } from './dbAuthProvider';
import { PamAuthProvider } from './pamAuthProvider';
import { MacAuthProvider } from './macAuthProvider';
import os from 'os';
import { logger } from '@/utils/logger';

export type AuthType = 'db' | 'system';

export class AuthProviderFactory {
  static createProvider(type: AuthType = 'db'): AuthProvider {
    logger.info(`Creating auth provider of type: ${type}, os: ${os.platform()}`);
    if (type === 'system') {
      // 根据操作系统选择合适的认证提供者
      switch (os.platform()) {
        case 'darwin':
          return new MacAuthProvider();
        case 'linux':
          return new PamAuthProvider();
        default:
          console.warn('System authentication not supported on this platform, falling back to database auth');
          return new DbAuthProvider();
      }
    }
    return new DbAuthProvider();
  }
} 