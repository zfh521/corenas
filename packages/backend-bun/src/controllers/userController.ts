import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import type { User, PaginationParams } from '../types/index';
import { asyncErrorHandler } from '../middleware/errorHandler';
import { NotFoundError } from '../types/error';

export const getUser = asyncErrorHandler(async (req: Request<{ id: string }>, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await UserService.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { password, ...userWithoutPassword } = user;
  res.json({
    status: 'success',
    data: userWithoutPassword
  });
});

export const updateUser = asyncErrorHandler(async (req: Request<{ id: string }, {}, Partial<User>>, res: Response) => {
  const userId = parseInt(req.params.id);
  const updatedUser = await UserService.updateUser(userId, req.body);
  
  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  const { password, ...userWithoutPassword } = updatedUser;
  res.json({
    status: 'success',
    data: userWithoutPassword
  });
});

export const deleteUser = asyncErrorHandler(async (req: Request<{ id: string }>, res: Response) => {
  const userId = parseInt(req.params.id);
  const deleted = await UserService.deleteUser(userId);
  
  if (!deleted) {
    throw new NotFoundError('User not found');
  }

  res.json({
    status: 'success',
    data: {
      message: 'User deleted successfully'
    }
  });
});

export const listUsers = asyncErrorHandler(async (req: Request<{}, {}, {}, PaginationParams>, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await UserService.listUsers(page, limit);
  
  const usersWithoutPassword = result.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({
    status: 'success',
    data: {
      users: usersWithoutPassword,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    }
  });
}); 