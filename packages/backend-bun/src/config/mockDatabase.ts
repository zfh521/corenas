import { DatabaseAdapter } from '../interfaces/database';
import { BaseEntity } from '../types/index';

export class MockDatabase<T extends BaseEntity> implements DatabaseAdapter<T> {
  private entities: Map<number, T>;
  private sequences: Map<string, number>;
  private modelName: string;

  constructor(modelName: string) {
    this.entities = new Map();
    this.sequences = new Map([['id', 1]]);
    this.modelName = modelName;
  }

  async findOne({ where }: { where: Partial<T> }): Promise<T | null> {
    for (const entity of this.entities.values()) {
      const matches = Object.entries(where).every(
        ([key, value]) => entity[key as keyof T] === value
      );
      if (matches) return entity;
    }
    return null;
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const id = this.getNextId();
    const entity = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
    this.entities.set(id, entity);
    return entity;
  }

  private getNextId(): number {
    const currentId = this.sequences.get('id') || 1;
    this.sequences.set('id', currentId + 1);
    return currentId;
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const entity = this.entities.get(id);
    if (!entity) return null;
    const updated = { ...entity, ...data, updatedAt: new Date() };
    this.entities.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    return this.entities.delete(id);
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{
    items: T[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = options || {};
    const items = Array.from(this.entities.values());
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      items: items.slice(startIndex, endIndex),
      total,
      page,
      totalPages
    };
  }

  async findByCondition(params: Record<string, any>): Promise<{ items: T[] }> {
    const items = Array.from(this.entities.values()).filter(entity => 
      Object.entries(params).every(([key, value]) => 
        !value || entity[key as keyof T] === value
      )
    );
    return { items };
  }

  async batchDelete(params: { ids: number[] }): Promise<boolean> {
    params.ids.forEach(id => this.entities.delete(id));
    return true;
  }

  async findByRoles(params: { role_ids: number[]; min_roles?: number }): Promise<{ items: T[] }> {
    return { items: [] }; // Mock implementation
  }
}

// 存储所有数据库实例
const databases = new Map<string, MockDatabase<any>>();

export interface DataTypes {
  UUID: 'UUID';
  UUIDV4: 'UUIDV4';
  STRING: 'STRING';
  BOOLEAN: 'BOOLEAN';
}

export const DataTypes: DataTypes = {
  UUID: 'UUID',
  UUIDV4: 'UUIDV4',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN'
};

export const sequelize = {
  define: <T extends BaseEntity>(modelName: string, schema: any, options: any) => {
    const db = new MockDatabase<T>(modelName);
    databases.set(modelName, db);
    return db;
  },
  authenticate: async () => {
    console.log('Mock database connected successfully');
    return Promise.resolve();
  },
  sync: async () => {
    console.log('Mock database synchronized');
    return Promise.resolve();
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the mock database:', error);
    process.exit(1);
  }
}; 