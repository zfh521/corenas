import { Request, Response } from 'express';
import { asyncErrorHandler } from '../middleware/errorHandler';
import { AuthProviderFactory } from '../services/auth/authProviderFactory';
import { logger } from '@/utils/logger';

const authProvider = AuthProviderFactory.createProvider(process.env.AUTH_TYPE as 'db' | 'system');

export const login = asyncErrorHandler(async (req: Request, res: Response) => {
  logger.info(`Login request received: ${JSON.stringify(req.body)}`);
  logger.info(`Auth provider type: ${authProvider.getType()}`);
  const result = await authProvider.login(req.body);
  res.json({
    status: 'success',
    data: result
  });
});

export const register = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!('register' in authProvider)) {
    return res.status(405).json({
      status: 'error',
      message: 'Registration not supported with current auth provider'
    });
  }

  const result = await authProvider.register!(req.body);
  res.status(201).json({
    status: 'success',
    data: result
  });
}); 