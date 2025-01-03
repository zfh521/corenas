import { DatabaseConfig } from '../interfaces/database';

export const getDatabaseConfig = (): DatabaseConfig => {
  const dbType = process.env.DB_TYPE as 'mock' | 'postgres';
  
  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }

  return { type: 'mock' };
}; 