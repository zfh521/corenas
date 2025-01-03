import { DatabaseAdapter, DatabaseConfig } from '../interfaces/database';
import { MockDatabase } from './mockDatabase';
import { PostgresDatabase } from './postgresDatabase';
import { BaseEntity } from '../types/index';
import { SqlLogger } from '../interfaces/sqlLogger';
import { WinstonSqlLogger } from '../utils/logger';

export class DatabaseFactory {
  static createAdapter<T extends BaseEntity>(
    modelName: string,
    config: DatabaseConfig,
    logger: SqlLogger = new WinstonSqlLogger()
  ): DatabaseAdapter<T> {
    switch (config.type) {
      case 'mock':
        return new MockDatabase<T>(modelName);
      case 'postgres':
        return new PostgresDatabase<T>(modelName, config, logger);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
} 