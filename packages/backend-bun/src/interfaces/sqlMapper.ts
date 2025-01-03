export interface SqlMapper {
  select(sql: string, params?: any): string;
  insert(sql: string, params?: any): string;
  update(sql: string, params?: any): string;
  delete(sql: string, params?: any): string;
}

export interface SqlDefinition {
  [key: string]: {
    sql: string;
    params?: string[];
  };
} 