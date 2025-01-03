export class SqlParser {
  static parse(sql: string, params?: Record<string, any>): string {
    if (!params) return sql;

    // 处理 IF 条件
    sql = this.parseIfConditions(sql, params);
    // 处理 FOR 循环
    sql = this.parseForEach(sql, params);
    // 处理参数替换
    sql = this.parseParams(sql, params);
    // 移除多余的空白字符
    return sql.replace(/\s+/g, ' ').trim();
  }

  private static parseIfConditions(sql: string, params: Record<string, any>): string {
    return sql.replace(
      /@if\s*\((.*?)\)(.*?)(@else(.*?))?@endif/gs,
      (match, condition, ifContent, _, elseContent = '') => {
        const evalResult = this.evaluateCondition(condition, params);
        return evalResult ? ifContent : elseContent;
      }
    );
  }

  private static parseForEach(sql: string, params: Record<string, any>): string {
    return sql.replace(
      /@foreach\s*\((.*?)\s+in\s+(.*?)\)(.*?)@endforeach/gs,
      (match, item, collection, content) => {
        const items = this.getValueFromParams(collection.trim(), params);
        if (!Array.isArray(items)) return '';

        return items
          .map(itemValue => {
            const itemParams = { ...params, [item.trim()]: itemValue };
            return this.parseParams(content, itemParams);
          })
          .join(', ');
      }
    );
  }

  private static parseParams(sql: string, params: Record<string, any>): string {
    return sql.replace(/#{(.*?)}/g, (match, key) => {
      const value = this.getValueFromParams(key.trim(), params);
      if (value === undefined) {
        throw new Error(`Missing parameter: ${key}`);
      }
      return this.escapeValue(value);
    });
  }

  private static evaluateCondition(condition: string, params: Record<string, any>): boolean {
    const evalCondition = condition
      .replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, (match) => {
        const value = this.getValueFromParams(match, params);
        if (typeof value === 'string') return `'${value}'`;
        return value?.toString() ?? 'undefined';
      });
    try {
      return eval(evalCondition);
    } catch {
      return false;
    }
  }

  private static getValueFromParams(path: string, params: Record<string, any>): any {
    return path.split('.').reduce((obj, key) => obj?.[key], params);
  }

  private static escapeValue(value: any): string {
    if (value === null) return 'NULL';
    if (Array.isArray(value)) {
      return `(${value.map(v => this.escapeValue(v)).join(', ')})`;
    }
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return `'${value.toString().replace(/'/g, "''")}'`;
  }
} 