import { Pool } from 'pg';
import { DatabaseAdapter, DatabaseConfig } from '../interfaces/database';
import { BaseEntity } from '../types/index';
import { SqlParser } from '../utils/sqlParser';
import { userSqlMap } from '../mappers/userMapper';
import { SqlLogger } from '../interfaces/sqlLogger';
import { DefaultSqlLogger } from '../utils/defaultSqlLogger';
import { createProxy } from '@/utils/proxy';

export class PostgresDatabase<T extends BaseEntity> implements DatabaseAdapter<T> {
  private pool: Pool;
  private sqlMap: Record<string, any>;
  private logger: SqlLogger;

  constructor(
    private modelName: string, 
    private config: DatabaseConfig,
    logger?: SqlLogger
  ) {
    this.logger = logger || new DefaultSqlLogger();
    
    try {
      this.pool = new Pool({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database
      });

      // 监听连接错误
      this.pool.on('error', (err) => {
        console.error('Unexpected database error:', err);
        this.logger.log({
          sql: 'Pool Error',
          timestamp: new Date(),
          error: {
            message: err.message,
            stack: err.stack,
            code: (err as any).code
          }
        });
      });

      // 测试连接
      this.pool.connect().catch(err => {
        console.error('Failed to connect to database:', {
          host: config.host,
          port: config.port,
          user: config.username,
          database: config.database,
          error: err.message
        });
        throw err;
      });
      this.pool = createProxy(this.pool);
      // 根据模型名称选择对应的 SQL 映射
      this.sqlMap = this.getSqlMap(modelName);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Database initialization failed:', errorMessage);
      throw error;
    }
  }

  private getSqlMap(modelName: string) {
    switch (modelName.toLowerCase()) {
      case 'user':
        return userSqlMap;
      // 添加其他模型的 SQL 映射
      default:
        throw new Error(`No SQL map found for model: ${modelName}`);
    }
  }

  private async executeQuery<R>(
    sql: string, 
    params?: Record<string, any>
  ): Promise<R> {
    const startTime = Date.now();
    try {
      const parsedSql = SqlParser.parse(sql, params);
      
      this.logger.log({
        sql: parsedSql,
        params,
        timestamp: new Date()
      });

      const result = await this.pool.query(parsedSql);
      
      const duration = Date.now() - startTime;
      this.logger.log({
        sql: parsedSql,
        params,
        duration,
        timestamp: new Date()
      });

      return result.rows as R;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      
      this.logger.log({
        sql,
        params,
        duration,
        timestamp: new Date(),
        error: {
          message: errorMessage,
          stack: errorStack,
          code: (error as any).code, // PostgreSQL error code
          detail: (error as any).detail, // PostgreSQL error detail
          hint: (error as any).hint, // PostgreSQL error hint
          position: (error as any).position // SQL position where error occurred
        }
      });
      
      console.error(`Database Error: ${errorMessage}\nSQL: ${sql}\nParams:`, params);
      throw error;
    }
  }

  async findOne({ where }: { where: Partial<T> }): Promise<T | null> {
    const [[key, value]] = Object.entries(where);
    const sqlDef = this.sqlMap[`findBy${key.charAt(0).toUpperCase() + key.slice(1)}`];
    if (!sqlDef) throw new Error(`No SQL definition found for findBy${key}`);

    const result = await this.executeQuery<T[]>(sqlDef.sql, { [key]: value });
    return result[0] || null;
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const sqlDef = this.sqlMap.create;
    const sql = SqlParser.parse(sqlDef.sql, data);
    const result = await this.pool.query(sql);
    return result.rows[0];
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const sqlDef = this.sqlMap.update;
    const sql = SqlParser.parse(sqlDef.sql, { id, ...data });
    const result = await this.pool.query(sql);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const sqlDef = this.sqlMap.delete;
    const sql = SqlParser.parse(sqlDef.sql, { id });
    const result = await this.pool.query(sql);
    return result.rowCount ? true : false;
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{
    items: T[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = options || {};
    const offset = (page - 1) * limit;

    // 获取总数
    const countSql = SqlParser.parse(this.sqlMap.count.sql);
    const countResult = await this.pool.query(countSql);
    const total = parseInt(countResult.rows[0].total);

    // 获取分页数据
    const sql = SqlParser.parse(this.sqlMap.findAll.sql, { limit, offset });
    const result = await this.pool.query(sql);

    return {
      items: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByCondition(params: Record<string, any>): Promise<{ items: T[] }> {
    const result = await this.executeQuery<T[]>(this.sqlMap.findByCondition.sql, params);
    return { items: result };
  }

  async batchDelete(params: { ids: number[] }): Promise<boolean> {
    const result = await this.executeQuery<any>(this.sqlMap.batchDelete.sql, params);
    return result.rowCount > 0;
  }

  async findByRoles(params: { role_ids: number[]; min_roles?: number }): Promise<{ items: T[] }> {
    const result = await this.executeQuery<T[]>(this.sqlMap.findByRoles.sql, params);
    return { items: result };
  }
} 