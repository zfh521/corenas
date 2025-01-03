import { Request, Response, NextFunction } from 'express';
import { AppError, NotFoundError } from '../types/error';

interface ErrorResponse {
  status: 'error' | 'fail';
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ErrorResponse = {
    status: 'error',
    message: err.message || 'Internal server error'
  };

  // 只在开发环境下返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // 如果是自定义的 AppError，使用其状态码
  if (err instanceof AppError) {
    res.status(err.statusCode).json(response);
    return;
  }

  // 默认服务器错误
  res.status(500).json(response);
};

// 处理未捕获的异步错误
export const asyncErrorHandler = <
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    fn(req, res, next).catch(next);
  };
};

// 处理未找到的路由
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.path}`));
}; 