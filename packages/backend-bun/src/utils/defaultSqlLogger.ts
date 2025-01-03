import { SqlLogger, SqlLogInfo } from '../interfaces/sqlLogger';

export class DefaultSqlLogger implements SqlLogger {
  private static formatDuration(duration?: number): string {
    if (!duration) return '';
    return duration > 1000 
      ? `${(duration / 1000).toFixed(2)}s`
      : `${duration.toFixed(2)}ms`;
  }

  private static formatParams(params?: Record<string, any>): string {
    if (!params) return '';
    return Object.entries(params)
      .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
      .join('\n');
  }
  log(info: SqlLogInfo): void {
    const timestamp = info.timestamp.toISOString();
    const duration = DefaultSqlLogger.formatDuration(info.duration);
    const params = DefaultSqlLogger.formatParams(info.params);

    console.log(`
[SQL] ${timestamp} ${duration}
${info.sql}
${params}
----------------------------------------`);
  }
} 