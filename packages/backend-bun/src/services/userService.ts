import { User } from '../models/User';
import { Op } from 'sequelize';

export class UserService {
  static async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  static async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    const { password, ...updateData } = data;
    return user.update(updateData);
  }

  static async deleteUser(id: number): Promise<boolean> {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }

  static async listUsers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      users: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  static async findByCondition(params: Record<string, any>) {
    const where: any = {};
    if (params.username) {
      where.username = { [Op.like]: `%${params.username}%` };
    }
    if (params.email) {
      where.email = params.email;
    }

    const users = await User.findAll({ where });
    return { items: users };
  }

  static async batchDelete(ids: number[]): Promise<boolean> {
    const deleted = await User.destroy({ where: { id: ids } });
    return deleted > 0;
  }
} 