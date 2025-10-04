import { Op } from 'sequelize';
import { User } from '../models';
import { hashPassword } from '../utils/password';
import { CreateUserInput, UpdateUserInput, QueryParams } from '../validators/users.validator';
import { PaginatedResponse } from '../types';

export class UsersService {
  async getAll(query: QueryParams): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Only get top-level users (no parent)
    where.parentId = null;

    const { rows: users, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'children',
          include: [
            {
              model: User,
              as: 'children', // Nested children
            },
          ],
        },
      ],
      attributes: { exclude: ['password'] },
    });

    return {
      data: users.map((user) => user.toJSON()),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getById(id: string) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'children',
          include: [{ model: User, as: 'children' }],
        },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  async create(data: CreateUserInput) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await User.create(data);
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    await user.update(data);
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async delete(id: string) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }
}