import { SqlLogger, SqlLogInfo } from '../interfaces/sqlLogger';
import fs from 'fs';
import path from 'path';

export class FileSqlLogger implements SqlLogger {
  private logStream: fs.WriteStream;

  constructor(logPath: string = 'logs/sql.log') {
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logStream = fs.createWriteStream(logPath, { flags: 'a' });
  }

  log(info: SqlLogInfo): void {
    const logEntry = {
      ...info,
      timestamp: info.timestamp.toISOString()
    };
    this.logStream.write(`${JSON.stringify(logEntry)}\n`);
  }

  close(): void {
    this.logStream.end();
  }
} 