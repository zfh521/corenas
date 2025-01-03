import { BaseEntity } from '../types/index';

export interface DatabaseAdapter<T extends BaseEntity> {
  findOne(query: { where: Partial<T> }): Promise<T | null>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
  findAll(options?: { page?: number; limit?: number }): Promise<{
    items: T[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findByCondition(params: Record<string, any>): Promise<{ items: T[] }>;
  batchDelete(params: { ids: number[] }): Promise<boolean>;
  findByRoles(params: { role_ids: number[]; min_roles?: number }): Promise<{ items: T[] }>;
}

export interface DatabaseConfig {
  type: 'mock' | 'postgres';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
} 