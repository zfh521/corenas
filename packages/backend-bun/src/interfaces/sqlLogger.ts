export interface SqlLogInfo {
  sql: string;
  params?: Record<string, any>;
  duration?: number;
  timestamp: Date;
  error?: unknown;
}

export interface SqlLogger {
  log(info: SqlLogInfo): void;
} 