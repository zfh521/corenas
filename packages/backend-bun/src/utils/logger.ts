import winston from 'winston';
import path from 'path';
import { SqlLogger, SqlLogInfo } from '@/interfaces/sqlLogger';

const { combine, timestamp, printf, colorize } = winston.format;

// 自定义日志格式
const logFormat = printf((info) => {
  const { level, message, timestamp, sql, params, duration } = info;
  let output = `${timestamp} ${level}: ${message}`;
  
  if (sql) {
    output += `\nSQL: ${sql}`;
    if (params) output += `\nParams: ${JSON.stringify(params, null, 2)}`;
    if (duration) output += `\nDuration: ${duration}ms`;
  }
  
  return output;
});

// 创建 Winston logger
export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    // 文件输出 - 错误日志
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    // 文件输出 - SQL日志
    new winston.transports.File({
      filename: path.join('logs', 'sql.log'),
      level: 'info'
    })
  ]
});

// SQL日志记录器
export class WinstonSqlLogger implements SqlLogger {
  log(info: SqlLogInfo): void {
    const level = info.error ? 'error' : 'info';
    logger.log({
      level,
      message: info.error ? 'SQL Error' : 'SQL Query',
      sql: info.sql,
      params: info.params,
      duration: info.duration,
      error: info.error,
      timestamp: info.timestamp
    });
  }
} 